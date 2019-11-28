import styled from 'styled-components';
const PHONE_SIZE = '767px';

const Responsive = styled.div.attrs({
  className: 'w-full overflow-x-auto'
})`
  min-height: 0.01%;

  @media (max-width: ${PHONE_SIZE}) {
    overflow-y: hidden;
  }
`;

const Table = styled.table.attrs({ className: 'w-full border' })``;

const Td = styled.td.attrs({ className: 'p-2 border' })``;
const TdCollapse = styled.td.attrs({
  className: 'p-2 border w-px whitespace-no-wrap'
})``;
const Th = styled.th.attrs({
  className: 'p-2 border text-left font-normal bg-teal-500 text-white'
})``;
const ThCollapse = styled.th.attrs({
  className:
    'p-2 border text-left font-normal bg-teal-500 text-white ' +
    'w-px whitespace-no-wrap'
})``;

const Tr = styled.tr.attrs({
  className: 'hover:bg-gray-200'
})`
  &:nth-of-type(even) {
    background-color: #f9f9f9;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

export default {
  Responsive,
  Table,
  Td,
  TdCollapse,
  Th,
  ThCollapse,
  Tr
};
