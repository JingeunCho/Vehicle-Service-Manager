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
 * 로컬 날짜 문자열(YYYY-MM-DD)을 UTC Instant ISO 문자열로 변환합니다.
 * 입력된 날짜의 "시작 시점(00:00:00)"을 UTC로 계산합니다.
 */
export const toUtcInstant = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    return new Date(dateStr).toISOString();
};
