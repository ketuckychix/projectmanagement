import React from 'react';
import './error.scss'

export default function ErrorPage(props) {
    return (
    <div>
    <h1>503</h1>
  <h2>Error: {props.message} <b>:(</b></h2>
  <div class="gears">
    <div class="gear one">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="gear two">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="gear three">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>    
    </div>)
};