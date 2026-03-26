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
    private val messageParser: MessageParser
) {

    fun processMessage(chatId: String, text: String): String {
        try {
            // 1. 연동 코드 (OTP) 처리
            if (text.startsWith("/start ")) {
                val otp = text.removePrefix("/start ").trim()
                botConnectionService.verifyOtpToken(otp, chatId)
                return "✅ 텔레그램 연동이 완료되었습니다! 이제 지출 내역을 입력해 주세요.\n(예: 주유 고급유 50000원 15000km)"
            }

            // 2. 메시지 파싱
            val parsedMessage = messageParser.parse(text)

            // 3. 계정 확인
            val member = botConnectionService.getMemberByPlatformUserId(chatId, PlatformType.TELEGRAM)
            
            // 4. 차량 연결 우선순위 확인
            val vehicles = vehicleService.getMyVehicles(member.email)
            if (vehicles.isEmpty()) {
                return "❌ 등록된 차량이 없습니다. 웹 대시보드에서 차량을 먼저 등록해 주세요."
            }
            // 임시로 보유 차량 중 첫 번째 차량에 지출 기록
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

            return "✅ 지출 기록 완료!\n" +
                   "차량: ${defaultVehicle.name}\n" +
                   "분류: ${ledger.category.name}\n" +
                   "금액: ${ledger.amount}원" +
                   (parsedMessage.mileage?.let { "\n누적 주행거리: ${it}km" } ?: "")

        } catch (e: Exception) {
            return "❗️ 오류 발생: ${e.message}"
        }
    }
}
