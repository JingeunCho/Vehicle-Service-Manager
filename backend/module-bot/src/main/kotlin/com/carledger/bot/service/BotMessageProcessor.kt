package com.carledger.bot.service

import com.carledger.bot.parser.MessageParser
import com.carledger.core.bot.domain.PlatformType
import com.carledger.core.bot.service.BotConnectionService
import com.carledger.core.ledger.service.LedgerService
import com.carledger.core.vehicle.service.VehicleService
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class BotMessageProcessor(
    private val botConnectionService: BotConnectionService,
    private val vehicleService: VehicleService,
    private val ledgerService: LedgerService,
    private val messageParser: MessageParser,
    private val passwordEncoder: org.springframework.security.crypto.password.PasswordEncoder
) {

    fun processMessage(chatId: String, text: String): BotResponse {
        try {
            // 1. 연동 코드 (OTP) 처리
            if (text.startsWith("/start ") || text.startsWith("/start@")) {
                val commandParts = text.split("\\s+".toRegex())
                if (commandParts.size >= 4) {
                    val otp = commandParts[1].trim()
                    val email = commandParts[2].trim()
                    val password = commandParts[3].trim()
                    
                    botConnectionService.verifyOtpToken(otp, chatId, email) { storedPassword ->
                        passwordEncoder.matches(password, storedPassword)
                    }
                    
                    return BotResponse("✅ 텔레그램 연동이 완료되었습니다! (30일간 유효)\n아래 버튼을 눌러 관리할 차량을 선택해 주세요.", listOf(
                        BotButton("내 차량 목록 보기", "LIST_VEHICLES")
                    ))
                } else if (commandParts.size > 1) {
                    return BotResponse("⚠️ 보안 강화를 위해 ID/PW 입력이 필요합니다.\n`/start [OTP] [Email] [Password]` 형식으로 보내주세요.")
                }
            }

            if (text == "/start" || text.startsWith("/start@")) {
                return try {
                    val member = botConnectionService.getMemberByPlatformUserId(chatId, PlatformType.TELEGRAM)
                    val vehicles = vehicleService.getMyVehicles(member.email)
                    if (vehicles.isEmpty()) {
                        BotResponse("❌ 등록된 차량이 없습니다. 웹 대시보드에서 차량을 먼저 등록해 주세요.")
                    } else {
                        BotResponse("🚗 관리할 차량을 선택해 주세요:", vehicles.map { 
                            BotButton("${it.name} (${it.licensePlate})", "SELECT_VEHICLE_${it.id}")
                        })
                    }
                } catch (e: Exception) {
                    BotResponse("👋 안녕하세요! 차계부 봇입니다. 서비스를 이용하시려면 웹 대시보드에서 발급받은 /start [OTP] 코드를 먼저 전송해 주세요.")
                }
            }

            // 2. 메시지 파싱
            val parsedMessage = messageParser.parse(text)

            // 3. 계정 확인
            val member = botConnectionService.getMemberByPlatformUserId(chatId, PlatformType.TELEGRAM)
            
            // 4. 차량 선택 확인 (임시로 첫 번째 차량 또는 세션 기반 선택 필요)
            val vehicles = vehicleService.getMyVehicles(member.email)
            if (vehicles.isEmpty()) {
                return BotResponse("❌ 등록된 차량이 없습니다. 웹 대시보드에서 차량을 먼저 등록해 주세요.")
            }
            // TODO: 세션에 저장된 차량 ID를 사용하도록 개선 예정 (Phase 1에서는 첫번째 차량 유지)
            val defaultVehicle = vehicles.first()

            // 5. 차계부 기록
            val ledger = ledgerService.createLedger(
                email = member.email,
                vehicleId = defaultVehicle.id,
                category = parsedMessage.category,
                amount = parsedMessage.amount,
                recordDate = Instant.now(),
                memo = parsedMessage.memo ?: "",
                mileage = parsedMessage.mileage,
                title = parsedMessage.title,
            )

            return BotResponse("✅ 지출 기록 완료!\n" +
                   "차량: ${defaultVehicle.name}\n" +
                   "분류: ${ledger.category.name}\n" +
                   "금액: ${ledger.amount}원" +
                   (parsedMessage.mileage?.let { "\n누적 주행거리: ${it}km" } ?: ""))

        } catch (e: Exception) {
            return BotResponse("❗️ 오류 발생: ${e.message}")
        }
    }

    fun processCallback(chatId: String, data: String): BotResponse {
        return when {
            data == "LIST_VEHICLES" -> processMessage(chatId, "/start")
            data.startsWith("SELECT_VEHICLE_") -> {
                val vehicleId = data.removePrefix("SELECT_VEHICLE_").toLong()
                // TODO: 세션에 사용자별 선택 차량 저장 로직 추가 예정
                BotResponse("✅ 차량이 선택되었습니다. (ID: $vehicleId)\n이제 기록을 시작해 보세요!")
            }
            else -> BotResponse("❓ 알 수 없는 명령입니다.")
        }
    }
}
