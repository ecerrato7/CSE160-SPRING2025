

// Class for the tree trunk
class TreeTrunk {
    constructor() {
        this.type = 'trunk';
        this.position = [-0.5, -0.3];  // Position of the trunk (relative to the tree)
        this.color = [0.54, 0.27, 0.07, 1.0];  // Brown color for the trunk
        this.width = 0.5;  // Width of the trunk
        this.height = 2.5; // Height of the trunk
    }

    render() {
        var xy = this.position;  // Get position
        var rgb = this.color;     // Get color
        var width = this.width;   // Get width
        var height = this.height; // Get height

        // Set color in the fragment shader
        gl.uniform4f(u_FragColor, rgb[0], rgb[1], rgb[2], rgb[3]);

        // Define the vertices for a rectangle (2 triangles)
        var vertices = [
            xy[0] - width / 2, xy[1] - height / 2,  // Bottom left
            xy[0] + width / 2, xy[1] - height / 2,  // Bottom right
            xy[0] - width / 2, xy[1] + height / 2,  // Top left

            xy[0] - width / 2, xy[1] + height / 2,  // Top left
            xy[0] + width / 2, xy[1] - height / 2,  // Bottom right
            xy[0] + width / 2, xy[1] + height / 2   // Top right
        ];

        // Call the function to draw the rectangle (trunk)
        drawTriangles(vertices);
    }
}

// Class for a tree branch
class TreeBranch {
    constructor(position, length, width, angle) {
        this.position = position;
        this.length = length;
        this.width = width;
        this.angle = angle;
        this.color = [0.54, 0.27, 0.07, 1.0];  // Brown color for the branches
    }

    render() {
        var xy = this.position;  // Position of the branch
        var length = this.length; // Length of the branch
        var width = this.width;   // Width of the branch
        var angle = this.angle;   // Angle of the branch

        var x1 = xy[0], y1 = xy[1];
        var x2 = x1 + length * Math.cos(angle * Math.PI / 180);
        var y2 = y1 + length * Math.sin(angle * Math.PI / 180);

        // Set branch color
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        // Create the branch as a thin rectangle (2 triangles)
        var vertices = [
            x1 - width / 2, y1,
            x2 - width / 2, y2,
            x1 + width / 2, y1,

            x1 + width / 2, y1,
            x2 + width / 2, y2,
            x2 - width / 2, y2
        ];

        // Draw the branch
        drawTriangles(vertices);
    }
}

class TreeLeaf {
    constructor(position, width = 0.05, height = 0.05, rotation = 0) {
        this.position = position;  // Position of the leaf
        this.color = [0.0, 0.5, 0.0, 1.0];  // Green color for the leaf
        this.width = width;  // Width of the leaf
        this.height = height; // Height of the leaf
        this.rotation = rotation; // Rotation in degrees
    }

    render() {
        var xy = this.position;
        var w = this.width;
        var h = this.height;
        var rgb = this.color;
        var rotation = this.rotation;

        // Convert rotation to radians
        var angle = rotation * Math.PI / 180;

        // Set color in the fragment shader
        gl.uniform4f(u_FragColor, rgb[0], rgb[1], rgb[2], rgb[3]);

        // Define the original vertices for the leaf
        var vertices = [
            [xy[0], xy[1] + h],     // Top
            [xy[0] - w, xy[1] - h], // Bottom left
            [xy[0] + w, xy[1] - h]  // Bottom right
        ];

        // Apply the rotation to each vertex
        var rotatedVertices = vertices.map(function (vertex) {
            var x = vertex[0] - xy[0];   
            var y = vertex[1] - xy[1];

            // Apply rotation matrix
            var newX = x * Math.cos(angle) - y * Math.sin(angle);
            var newY = x * Math.sin(angle) + y * Math.cos(angle);

            // Translate back to original position
            return [newX + xy[0], newY + xy[1]];
        });

        // Flatten the array of rotated vertices
        var flatVertices = rotatedVertices.flat();

        // Call the function to draw the rotated leaf
        drawTriangles(flatVertices);
    }
}



  
class Apple {
    constructor(position, color = [1.0, 0.0, 0.0, 1.0], size = 5) {
        this.position = position;  // [x, y] coordinates
        this.color = color;        // RGBA color (Red for apple)
        this.size = size;          // Controls the apple size (in points)
    }

    render() {
        // Create a point object to represent the apple
        let applePoint = new Point();
        applePoint.position = this.position; // Set the position of the apple
        applePoint.color = this.color;       // Set the color of the apple
        applePoint.size = this.size;         // Set the size of the apple point

        // Render the apple as a point (it will appear as a circle due to the size)
        applePoint.render();
    }
}

 
class Grass {
    constructor() {
        this.color = [0.0, 0.8, 0.0, 1.0];  // Green color for grass
        this.width = 2.0;  // Full width of the canvas
        this.height = 0.65; // Height of the grass strip
        this.position = [0.0, -1];  // Position just below the tree
    }

    render() {
        var xy = this.position;  // Position of the grass
        var width = this.width;   // Width of the grass
        var height = this.height; // Height of the grass

        // Set grass color
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        // Define the vertices for the grass (a rectangle made of 2 triangles)
        var vertices = [
            xy[0] - width / 2, xy[1],               // Bottom left
            xy[0] + width / 2, xy[1],               // Bottom right
            xy[0] - width / 2, xy[1] + height,      // Top left

            xy[0] - width / 2, xy[1] + height,      // Top left
            xy[0] + width / 2, xy[1],               // Bottom right
            xy[0] + width / 2, xy[1] + height       // Top right
        ];

        // Draw the grass
        drawTriangles(vertices);
    }
}






function drawPicture() {
    // Set the background color of the canvas to light blue
    gl.clearColor(0.678, 0.847, 0.902, 1.0); // Light blue (R, G, B, A)
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas with the set color

    // Create and render the tree trunk
    let treeTrunk = new TreeTrunk();
    treeTrunk.render();  // Draw the trunk  

    // Create and render multiple branches at different angles
    let branch1 = new TreeBranch([-.29,.5], 1, 0.05, 40);
   // let branch2 = new TreeBranch([0.0, -0.1], 0.3, 0.05, -30);
    //let branch3 = new TreeBranch([0.0, 0.0], 0.35, 0.05, 50);
   // let branch4 = new TreeBranch([0.0, 0.1], 0.3, 0.05, -45);
    //let branch5 = new TreeBranch([0.0, 0.2], 0.25, 0.05, 30);
    
    branch1.render();
  //  branch2.render();
  //  branch3.render();
   // branch4.render();
   // branch5.render();

    // Create and render leaves on the branches
    let leaf1 = new TreeLeaf([-.21,.51]);
    let leaf2 = new TreeLeaf([-.16,.56]);
    let leaf3 = new TreeLeaf([-.11,.61]);
    let leaf4 = new TreeLeaf([-.06,.66]);
    let leaf5 = new TreeLeaf([0.01,.71]);
    let leaf6 = new TreeLeaf([.06,.76]);
    let leaf7 = new TreeLeaf([.11,.81]);
    let leaf8 = new TreeLeaf([.16,.86]);
    let leaf9 = new TreeLeaf([.21,.91]);
    let leaf10 = new TreeLeaf([.26,.96]);
    let leaf11 = new TreeLeaf([.31,1.01]);
    let leaf12 = new TreeLeaf([.36,1.06]);

    let leaf13 = new TreeLeaf([-.5,.91],0.65,.15);

 
    leaf1.render();
    leaf2.render();
    leaf3.render();
    leaf4.render();
   leaf5.render();
    leaf6.render();
    leaf7.render();
    leaf8.render();
    leaf9.render();
    leaf10.render();
    leaf11.render();
    leaf12.render();


    leaf13.render();



    let apple1 = new Apple([0.0, 0.5], [1.0, 0.0, 0.0, 1.0], 10);
    apple1.render(); // Render the apple at its position
    
    //figure 
    let apple2 = new Apple([0.0, -0.30], [0.0, 0.0, 0.5, 1.0], 30);   


    let apple3 = new Apple([0.0, -0.2], [1.0, 0.8, 0.6, 1.0], 20);  // Skin color
    let apple4 = new Apple([0.0, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple5 = new Apple([0.01, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple6 = new Apple([0.02, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple7 = new Apple([0.03, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple8 = new Apple([-0.01, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple9 = new Apple([-0.02, -0.15], [0.0, 0.0, 0.0, 1.0], 5);
    let apple10 = new Apple([-0.03, -0.15], [0.0, 0.0, 0.0, 1.0], 5);


    apple2.render();
    apple3.render();
    apple4.render();
    apple5.render();
    apple6.render();
    apple7.render();
    apple8.render();
    apple9.render();
    apple10.render();



    //Rocket just because 
    let apple11 = new Apple([.6, .6], [0.0, 0.5, 0.0, 1.0] , 40);
    let apple12 = new Apple([.6, .7], [0.0, 0.5, 0.0, 1.0] , 40);
    let leaf14 = new TreeLeaf([.6,.4],0.1,.1,180);

    let leaf15 = new TreeLeaf([.6, .8],0.2, .1 ,180);
    
    
    apple11.render(); // Render the apple at its position
    apple12.render(); // Render the apple at its position
    leaf14.render();
    leaf15.render(); // Render the apple at its position
   
    // Create and render the grass
    let grass = new Grass();
    grass.render();
}


