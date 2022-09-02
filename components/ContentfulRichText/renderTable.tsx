import styled from "@emotion/styled"
import { palette } from "@leafygreen-ui/palette"
import ContentfulRichText from "."

export const renderTable = (node, children) => <table>{node.content.map(node => <ContentfulRichText document={node} />)}</table>
export const renderTableRow = (node, children) => <tr>{node.content.map(node => <ContentfulRichText document={node} />)}</tr>

const StyledTh = styled('th')`
  > * { 
    font-weight: 700;
  }
  min-width: 120px;
  text-align: left;
  padding: 8px;
  border-bottom: 3px solid ${palette.gray.light2};
`;
export const renderTableHeaderCell = (node, children) => <StyledTh>{node.content.map(node => <ContentfulRichText document={node} />)}</StyledTh>

const StyledTd = styled('td')`
  min-width: 120px;
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid ${palette.gray.light2};
`;
export const renderTableCell = (node, children) => <StyledTd>{node.content.map(node => <ContentfulRichText document={node} />)}</StyledTd>