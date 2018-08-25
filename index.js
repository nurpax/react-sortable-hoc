import 'babel-polyfill';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from './src/index';
import range from 'lodash/range';
import random from 'lodash/random';

function rect(props) {
  const {ctx, x, y, width, height} = props;
  ctx.fillStyle = '#f00'
  ctx.fillRect(x, y, width, height);
}

class Circle extends Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.updateCanvas()
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.ref.current.getContext('2d');
    ctx.clearRect(0,0, 50, 50);
    // draw children “components”
    rect({ctx, x: 10, y: 10, width: 10, height: 10});
    rect({ctx, x: 20, y: 30, width: 10, height: 10});
  }

  render () {
    return (
      <canvas ref={this.ref} width={50} height={50}>
      </canvas>
    )
  }
}

const SortableItem = SortableElement(({height, value}) => (
    <div style={{
        position: 'relative',
        width: '100%',
        display: 'block',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottom: '1px solid #EFEFEF',
        boxSizing: 'border-box',
        WebkitUserSelect: 'none',
        height: height
    }}>
        Item {value}
        <Circle />
    </div>
));

const SortableList = SortableContainer(({items}) => (
    <div style={{
        width: '80%',
        height: '80vh',
        maxWidth: '500px',
        margin: '0 auto',
        overflow: 'auto',
        backgroundColor: '#f3f3f3',
        border: '1px solid #EFEFEF',
        borderRadius: 3
    }}>
        {items.map(({height, value}, index) => <SortableItem key={`item-${index}`} index={index} value={value} height={height}/>)}
    </div>
));

class Example extends Component {
    state = {
        items: range(100).map((value) => {
            return {
                value,
                height: '100px'
            };
        })
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;

        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    };
    render() {
        const {items} = this.state;

        return <SortableList items={items} onSortEnd={this.onSortEnd} />;
    }
}

render(<Example />,
  document.getElementById('root')
)
