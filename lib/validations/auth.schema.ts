import z from "zod";

export const authSchema = z.object({
  username: z
    .string("Username tidak valid")
    .min(3, "Username minimal 3 karakter"),
  telepon: z
    .string("Nomor telepon tidak valid")
    .min(10, "Nomor telepon minimal 10 angka")
    .max(13, "Nomor telepon maksimal 13 angka, tidak valid"),
});

export type authSchema = z.infer<typeof authSchema>;
