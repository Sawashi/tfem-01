import React from 'react';
import { formatDate } from 'utils';

interface DateRowProps {
  date: string;
}

const DateRow = (props: DateRowProps) => {
  const { date } = props;
  return <div>{formatDate(date)}</div>;
};

export default DateRow;

