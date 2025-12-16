'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { createReply } from '@/app/(root)/threads/[id]/actions';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { ReplySchema, type ReplyInput } from '@/lib/validators/reply';

export function ReplyForm({ threadId }: { threadId: string }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ReplyInput>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      threadId,
      body: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(values: ReplyInput) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await createReply(values);

      if (!res.ok) {
        setServerError(res.error ?? 'Something went wrong.');
        return;
      }

      form.reset({ threadId, body: '' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-3'
    >
      <Controller
        name='body'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='reply'>Your reply</FieldLabel>
            <Textarea
              {...field}
              id='reply'
              rows={5}
              placeholder='Write your reply…'
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {serverError && <p className='text-destructive text-sm'>{serverError}</p>}

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting…' : 'Post reply'}
        </Button>
      </div>
    </form>
  );
}
