"use client"

import { z } from "zod"

const formSchema = z.object({
  role : z.enum(['Director','Instructor']),
  pay : z.number()
});

export default formSchema;