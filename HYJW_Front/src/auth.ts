
export const getToken = (): string => {
    let token = sessionStorage.getItem("jwt") || sessionStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found.");

    token = token.trim();

    // "Bearer " 접두사가 있으면 제거
    if (token.startsWith("Bearer ")) token = token.substring(7).trim();

    // "jwt " 접두사 제거 (예비 처리)
    if (token.toLowerCase().startsWith("jwt ")) token = token.substring(4).trim();

    // JWT 형식 검증 (마침표 2개)
    if ((token.match(/\./g) || []).length !== 2) {
        console.warn("Token 형식이 JWT가 아님:", token);
    }

    return token;
};
