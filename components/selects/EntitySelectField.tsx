import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import React from "react";
import { EntitySelect, EntitySelectProps } from "./EntitySelect";

export type EntitySelectFieldProps = EntitySelectProps & {
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
};

/** Form-bound wrapper around EntitySelect — label, required marker, validation error. */
export const EntitySelectField = ({
  label,
  isRequired,
  errorMessage,
  ...selectProps
}: EntitySelectFieldProps) => (
  <FormControl isRequired={isRequired} isInvalid={!!errorMessage}>
    {!!label && (
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
    )}
    <EntitySelect {...selectProps} isInvalid={!!errorMessage} />
    <FormControlError>
      <FormControlErrorText>{errorMessage}</FormControlErrorText>
    </FormControlError>
  </FormControl>
);
