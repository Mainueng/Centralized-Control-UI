//import Axios from "axios";
import React, { Fragment, useState } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";

const ResizableContent = (props) => {
  const [width] = useState(props.width);
  const [height] = useState(props.height);
  const [top, setTop] = useState(props.top);
  const [left, setLeft] = useState(props.left);
  const [rotateAngle, setRotateAngle] = useState(props.rotateAngle);

  const contentStyle = {
    top,
    left,
    width,
    height,
    position: "absolute",
    transform: `rotate(${rotateAngle}deg)`,
  };

  // const handleResize = (style, isShiftKey, type) => {
  //   const { top, left, width, height } = style;
  //   setWidth(Math.round(width));
  //   setHeight(Math.round(height));
  //   setTop(Math.round(top));
  //   setLeft(Math.round(left));
  // };

  const handleRotate = (rotateAngle) => {
    setRotateAngle(rotateAngle);
  };

  const handleDrag = (deltaX, deltaY) => {
    let height = document.getElementById("plan").clientHeight;
    let width = document.getElementById("plan").clientWidth;

    if (left + deltaX > -1 && left + deltaX < width - 58) {
      setLeft(left + deltaX);
    }

    if (top + deltaY > -1 && top + deltaY < height - 58) {
      setTop(top + deltaY);
    }
  };

  const handleDragEnd = () => {
    let height = document.getElementById("plan").clientHeight;
    let width = document.getElementById("plan").clientWidth;

    let x = (left / width) * 100;
    let y = (top / height) * 100;

    let data = {
      x_axis: x,
      y_axis: y,
    };

    props.drag(props.id, data);
  };

  const handleRotateEnd = () => {
    let data = {
      rotate_angle: rotateAngle,
    };

    props.rotate(props.id, data);
  };

  return (
    <Fragment>
      <div style={contentStyle}>{props.children}</div>
      <ResizableRect
        top={top}
        rotatable
        left={left}
        aspectRatio
        minWidth={10}
        width={width}
        minHeight={10}
        height={height}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onRotate={handleRotate}
        onRotateEnd={handleRotateEnd}
        //onResize={handleResize}
        //zoomable="nw, ne, se, sw"
        rotateAngle={rotateAngle}
      />
    </Fragment>
  );
};

export default ResizableContent;
