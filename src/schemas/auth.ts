import { z } from "zod";

// Rôles applicatifs (2 nouveaux: CLIENT et ARTISAN)
export const appRoleSchema = z.enum(["USER", "ADMIN", "CLIENT", "ARTISAN"]);
export type AppRole = z.infer<typeof appRoleSchema>;

export const signupClientSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis."),
  lastName: z.string().trim().min(1, "Le nom est requis."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  phoneNumber: z.string().trim().optional(),
});

export type SignupClientInput = z.infer<typeof signupClientSchema>;
