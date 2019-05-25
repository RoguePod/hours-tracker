import styled from 'styled-components';

const Responsive = styled.div.attrs({
  className: 'w-full overflow-x-auto'
})``;

const Table = styled.table.attrs({ className: 'w-full border' })``;

const Td = styled.td.attrs({ className: 'p-2 border' })``;
const Th = styled.td.attrs({
  className: 'p-2 border text-left font-normal bg-blue-500 text-white'
})``;

export default {
  Responsive,
  Table,
  Td,
  Th
};
