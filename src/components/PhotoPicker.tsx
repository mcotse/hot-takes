import { useRef, useEffect, type ChangeEvent } from 'react'

export interface PhotoPickerProps {
  /** Called when a photo file is selected */
  onPhotoSelect: (file: File) => void
  /** Called with trigger function when component mounts */
  onTriggerReady?: (trigger: () => void) => void
}

/**
 * PhotoPicker Component
 *
 * A hidden file input that opens the device's photo picker.
 * Use onTriggerReady to get a function that opens the picker.
 *
 * IMPORTANT: When storing the trigger in React state, you must wrap it
 * in an arrow function to prevent React from treating it as a functional
 * state updater and calling it immediately.
 *
 * Example:
 * ```tsx
 * const [trigger, setTrigger] = useState<(() => void) | null>(null)
 *
 * <PhotoPicker
 *   onPhotoSelect={handlePhoto}
 *   // Wrap in arrow function to prevent immediate invocation!
 *   onTriggerReady={(fn) => setTrigger(() => fn)}
 * />
 *
 * <button onClick={() => trigger?.()}>Choose Photo</button>
 * ```
 */
export const PhotoPicker = ({
  onPhotoSelect,
  onTriggerReady,
}: PhotoPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Expose trigger function to parent
  // Note: We wrap in an extra arrow function to prevent React from
  // interpreting this as a functional state updater and calling it immediately
  useEffect(() => {
    if (onTriggerReady && inputRef.current) {
      const triggerFn = () => {
        inputRef.current?.click()
      }
      onTriggerReady(triggerFn)
    }
  }, [onTriggerReady])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onPhotoSelect(file)
      // Reset input to allow selecting same file again
      e.target.value = ''
    }
  }

  return (
    <input
      ref={inputRef}
      data-testid="photo-input"
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />
  )
}
