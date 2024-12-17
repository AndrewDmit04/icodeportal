"use client"

import { z } from "zod"

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role : z.enum(['Director','Instructor'])
});

export default formSchema;