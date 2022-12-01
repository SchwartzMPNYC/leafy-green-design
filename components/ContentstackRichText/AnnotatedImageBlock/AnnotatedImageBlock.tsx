import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import ImageContainer from './ImageContainer';
import StyledList from './StyledList';
import StyledListItem from './StyledListItem';

const AnnotatedImageBlock = ({ entry }) => {
  return (
    <div>
      <ImageContainer>
        <img src={entry.image.url} alt={entry.title} />
      </ImageContainer>
      <StyledList>
        {entry.steps.map(obj => (
          <StyledListItem>
            <Body
              css={css`
                display: inline;
                margin-left: 4px;
                font-size: 13px;
                line-height: 24px;
              `}
            >
              <b
                css={css`
                  display: inline;
                `}
              >
                {obj.step.title}
                {obj.step.description ? ':' : ''}&nbsp;
              </b>
              <span
                css={css`
                  color: ${palette.gray.dark1};
                  display: inline;
                `}
              >
                {obj.step.description}
              </span>
            </Body>
          </StyledListItem>
        ))}
      </StyledList>
    </div>
  );
};

export default AnnotatedImageBlock;
