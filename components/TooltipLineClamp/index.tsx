import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { useEffect, useRef, useState } from "react";
import { TextLineClamp } from "styles/common/Common.style";

interface Props {
  children: React.ReactNode;
  line?: number;
  textLength?: number;
  placement?: TooltipPlacement;
}

const TooltipLineClamp = (props: Props): JSX.Element => {
  const [isTextOverflowed, setIsTextOverflowed] = useState(false);
  const ref = useRef<any | null>(null);

  useEffect(() => {
    if (ref.current) {
      const isOverflowed = ref.current.scrollHeight > ref.current.clientHeight;
      setIsTextOverflowed(isOverflowed);
      if (
        typeof props.children === "string" &&
        props.textLength &&
        props.children.length > props.textLength
      ) {
        setIsTextOverflowed(true);
      }
    }
  }, []);

  return (
    <Tooltip
      title={isTextOverflowed ? props.children : ""}
      placement={props?.placement}
    >
      <TextLineClamp ref={ref} $line={props.line || 1}>
        {props.children}
      </TextLineClamp>
    </Tooltip>
  );
};

export default TooltipLineClamp;
