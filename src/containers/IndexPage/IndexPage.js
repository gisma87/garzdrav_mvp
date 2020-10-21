import React, {Fragment} from 'react';
import LayoutMobile from "../../hoc/LayoutMobile/LayoutMobile";
import IndexMobile from "../../containers/IndexMobile/IndexMobile";
import LayoutDesktop from "../../hoc/LayoutDesktop/LayoutDesktop";
import IndexDesktop from "../../containers/IndexDesktop/IndexDesktop";
import Media from 'react-media';

function IndexPage() {
  return (
    <Fragment>
      <Media queries={{
        mobile: "(max-width: 766px)",
        desktop: "(min-width: 768px)"
      }}>
        {matches => (
          <Fragment>
            {matches.mobile && <LayoutMobile>
              <IndexMobile/>
            </LayoutMobile>}
            {matches.desktop && <LayoutDesktop>
              <IndexDesktop/>
            </LayoutDesktop>}
          </Fragment>
        )}
      </Media>
    </Fragment>
  );
}

export default IndexPage
