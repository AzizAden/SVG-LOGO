import inquirer from 'inquirer';
import fs from 'fs';

class Shapes {
  constructor() {
    this.color = '';
  }

  setColor(color) {
    this.color = color;
  }
}

class Triangle extends Shapes {
  render() {
    return `<polygon points="150, 50 50, 150 250, 150" style="fill: ${this.color}"/>`;
  }
}

class Circle extends Shapes {
  render() {
    return `<circle cx="150" cy="100" r="75" style="fill:${this.color}"/>`;
  }
}

class Square extends Shapes {
  render() {
    return `<rect x="50" y="50" width="200" height="200" style="fill:${this.color}"/>`;
  }
}

// Prompt user for input
inquirer
  .prompt([
    {
      name: 'text',
      message: 'Enter up to three characters:',
      validate: (input) => {
        if (input.length <= 3) {
          return true;
        }
        return 'Please enter up to three characters.';
      },
    },
    {
      name: 'textColor',
      message: 'Enter the text color:',
      default: 'black',
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Select a shape:',
      choices: ['circle', 'triangle', 'square'],
    },
    {
      name: 'shapeColor',
      message: 'Enter the shape color:',
      default: 'blue',
    },
  ])
  .then((answers) => {
    const { text, textColor, shape, shapeColor } = answers;

    const selectedShape = getShapeInstance(shape);
    selectedShape.setColor(shapeColor);

    const svgContent = generateSVG(text, textColor, selectedShape);

    fs.writeFile('logo.svg', svgContent, (err) => {
      if (err) {
        console.error('Error writing SVG file:', err);
      } else {
        console.log('Generated logo.svg');
      }
    });
  });

function getShapeInstance(shape) {
  switch (shape) {
    case 'circle':
      return new Circle();
    case 'triangle':
      return new Triangle();
    case 'square':
      return new Square();
    default:
      throw new Error(`Invalid shape: ${shape}`);
  }
}

function generateSVG(text, textColor, shape) {
  const svgContent = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="100" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
      ${shape.render()}
    </svg>
  `;
  return svgContent;
}
