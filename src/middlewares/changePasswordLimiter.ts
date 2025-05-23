import rateLimit from "express-rate-limit";

export const changePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // Limite de 5 tentativas por IP
  message: "Muitas tentativas. Tente novamente mais tarde.",
});
