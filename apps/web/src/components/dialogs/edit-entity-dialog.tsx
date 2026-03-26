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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldConfig } from "@/lib/types"
import { useState, useEffect } from "react"
import { z } from "zod"


type Props<T extends z.ZodRawShape> = {
  title: string
  description: string
  schema: z.ZodObject<T>
  fields: FieldConfig<z.infer<z.ZodObject<T>>>[]
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: Partial<z.infer<z.ZodObject<T>>> | null
  onSubmit: (values: z.infer<z.ZodObject<T>>) => void
  buttonLabel?: string
}

export default function EditEntityDialog<T extends z.ZodRawShape>({
  title,
  description,
  schema,
  fields,
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  buttonLabel = "Update",
}: Props<T>) {
  type Values = z.infer<typeof schema>
  type FieldKey = keyof Values

  const [formState, setFormState] = useState<Partial<Values>>({})
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  // Populate form when initialValues change
  useEffect(() => {
    if (initialValues) setFormState(initialValues)
  }, [initialValues])

  const handleChange = (field: FieldKey, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse(formState)

    if (!result.success) {
      const fieldErrors: Partial<Record<FieldKey, string>> = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as FieldKey
        if (field) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    onSubmit(result.data)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  required
                />
                {errors[key] && (
                  <p className="text-red-500 text-xs">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">{buttonLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
