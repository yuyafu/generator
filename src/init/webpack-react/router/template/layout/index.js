'use strict';

import React from 'react';
import { Link } from 'react-router';
import  Navigation,{Item}  from '@alife/next/lib/navigation';
import './index.less';

//引用c中的header和leftSideMenu

class Layout extends React.Component {

  render() {
    return (
      <div className="layout-container">
      	<header>Tool Bar</header>
      	<div className="content">
      		<aside>  
  			 	<Navigation
			        type="tree"
			        style={{width: '100%'}}
			        title="Web Sites"
			    
			        >
			        <Item
			            itemid="0"
			            text={<Link to="/dashboard" >dashboard</Link>}
			            icon="service"
			            >
			        </Item>
			        <Item
			            itemid="1"
			            text={<Link to="/main" >main</Link>}
			            icon="service"
			            >
			        </Item>
			    </Navigation>
      		</aside>
      		<div className="content-body">
      			{this.props.children}
      		</div>
      		
      	</div>
        
      </div>
    )
  }
}

export default Layout;
