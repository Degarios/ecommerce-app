import { Button } from "native-base";
import React from "react";

function Buttone({ mt, bg, color, children, onPress, disabled }) {
  return (
    <Button
      w="full"
      h={55}
      mt={mt}
      rounded="full"
      bg={bg}
      _text={{
        color: color,
        fontWeight: "bold",
      }}
      _pressed={{ bg: bg }}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default Buttone;
