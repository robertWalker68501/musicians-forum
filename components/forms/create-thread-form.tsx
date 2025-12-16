'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { createThread } from '@/app/(root)/categories/[slug]/new/actions';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateThreadSchema,
  type CreateThreadInput,
} from '@/lib/validators/thread';

export function CreateThreadForm({ categorySlug }: { categorySlug: string }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateThreadInput>({
    resolver: zodResolver(CreateThreadSchema),
    defaultValues: {
      categorySlug,
      title: '',
      body: '',
    },
  });

  async function onSubmit(values: CreateThreadInput) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await createThread(values);
      // On success, server action will redirect; this only runs if it returns
      if (res && !res.ok) setServerError(res.error ?? 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-4'
    >
      <Controller
        name='title'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='title'>Title</FieldLabel>
            <Input
              {...field}
              id='title'
              placeholder='What’s the topic?'
              autoComplete='off'
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='body'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='body'>Post</FieldLabel>
            <Textarea
              {...field}
              id='body'
              rows={8}
              placeholder='Write your first post…'
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {serverError && <p className='text-destructive text-sm'>{serverError}</p>}

      <div className='flex justify-end gap-2'>
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting…' : 'Create thread'}
        </Button>
      </div>
    </form>
  );
}
