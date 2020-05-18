import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import StripeInput from "./StripeInput";

type Props = {
  component: React.ReactNode;
  label: string;
};

export default function StripeElementWrapper(props: Props) {
  const { component, label } = props;
  const [focused, setFocused] = React.useState(false);
  const [empty, setEmpty] = React.useState(true);
  const [error, setError] = React.useState<false | Error>(false);

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel
          focused={focused}
          shrink={focused || !empty}
          error={!!error}
        >
          {label}
        </InputLabel>
        <Input
          fullWidth
          inputComponent={StripeInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e: any) => {
            console.log(e);
            setError(error);
            setEmpty(empty);
          }}
          inputProps={{ component }}
        />
      </FormControl>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </div>
  );
}
