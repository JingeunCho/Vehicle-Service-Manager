/**
 * 서버에서 온 Instant(UTC ISO String)를 로컬 타임존의 날짜 문자열로 변환합니다.
 * 예: 2024-03-26T14:30:00Z -> 2024. 3. 26.
 */
export const formatToLocalDate = (instant: string | undefined): string => {
    if (!instant) return '-';
    return new Date(instant).toLocaleDateString();
};

/**
 * 서버에서 온 Instant를 로컬 타임존의 날짜와 시간 문자열로 변환합니다.
 * 예: 2024-03-26T14:30:00Z -> 2024. 3. 26. 오후 11:30:00 (KST 기준)
 */
export const formatToLocalDateTime = (instant: string | undefined): string => {
    if (!instant) return '-';
    return new Date(instant).toLocaleString();
};

/**
 * 서버에서 온 Instant를 <input type="date"> 의 value 규격(YYYY-MM-DD)으로 변환합니다.
 */
export const formatToInputDate = (instant: string | undefined): string => {
    if (!instant) return '';
    const date = new Date(instant);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 서버에서 온 Instant를 <input type="time"> 의 value 규격(HH:mm)으로 변환합니다.
 */
export const formatToInputTime = (instant: string | undefined): string => {
    if (!instant) return '';
    const date = new Date(instant);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * MM-DD HH:mm 형식으로 변환합니다. (대시보드 축약형)
 */
export const formatToDateTimeShort = (instant: string | undefined): string => {
    if (!instant) return '-';
    const date = new Date(instant);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
};

/**
 * 로컬 날짜(YYYY-MM-DD)와 시간(HH:mm) 문자열을 UTC Instant ISO 문자열로 변환합니다.
 */
export const toUtcInstant = (dateStr: string, timeStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    const time = timeStr || '00:00';
    // 로컬 시간 기준으로 Date 객체 생성
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const localDate = new Date(year, month - 1, day, hours, minutes);
    return localDate.toISOString();
};
