"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldConfig } from "@/lib/types"
import { useState } from "react"
import { z } from "zod"

type Props<T extends z.ZodRawShape> = {
  title: string
  description: string
  schema: z.ZodObject<T>
  fields: FieldConfig<z.infer<z.ZodObject<T>>>[]
  buttonLabel?: string
  onSubmit: (values: z.infer<z.ZodObject<T>>) => void
}

export default function NewEntityDialog<T extends z.ZodRawShape>({
  title,
  description,
  schema,
  fields,
  buttonLabel = "Add",
  onSubmit,
}: Props<T>) {
  type Values = z.infer<typeof schema>
  type FieldKey = keyof Values

  const [formState, setFormState] = useState<Partial<Values>>({})
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [open, setOpen] = useState(false)

  const handleChange = (field: FieldKey, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Force TS to know error has `.errors`
    const result = schema.safeParse(formState) as
      | { success: true; data: Values }
      | { success: false; error: z.ZodError<Values> }

    if (!result.success) {
      const fieldErrors: Partial<Record<FieldKey, string>> = {}
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as FieldKey
        if (field) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    onSubmit(result.data)
    setFormState({})
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map(({ key, label, placeholder, inputType }) => (
              <div key={String(key)} className="grid gap-2">
                <Label htmlFor={String(key)}>{label}</Label>
                <Input
                  id={String(key)}
                  type={inputType ?? "text"}
                  value={String(formState[key] ?? "")}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder ?? `Enter ${label}`}
                />
                {errors[key] && (
                  <p className="text-red-500 text-xs">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{buttonLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
