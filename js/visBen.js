/**
 * @author Ben
 */

var visBen = {
    init : function() {
    },

	current_story: [],

	/*============== Story Tree  ==============*/
	storyTree: function(nodes, edges){
		this.nodes = nodes;
		this.edges = edges;
		this.maxdepth = 0;
		this.root_node = null;

		this.getNodePosition = function(plainText){
			for (var i = 0; i < this.nodes.length; i++){
				if (this.nodes[i].plainText === plainText){
					return i;
				}
			}

			console.log("Error, node position could not be found");
			return -1;
		};

		this.existsNode = function(plainText){
			for (var node in this.nodes){
				if (this.nodes[node].plainText === plainText){
					return true;
				}
			}
			return false;
		};

		this.getNodeAtPosition = function(plainText, position){
			for (var i = 0; i < this.nodes.length; i++){
				if (this.nodes[i].plainText === plainText && this.nodes[i].position === position){
					return i;
				}
			}
			console.log("Error, node position could not be found");
			return -1;
		};

		this.existsNodeAtPosition = function(plainText, position){
			for (var node in this.nodes){
				if (this.nodes[node].plainText === plainText && this.nodes[node].position === position){
					return true;
				}
			}
			return false;
		};

		this.linkNodesPosition = function(from_node, to_node, trace){

			var from = this.getNodeAtPosition(from_node.plainText, from_node.position);
			var to = this.getNodeAtPosition(to_node.plainText, to_node.position);
			
			this.nodes[from].children.push(to);
			this.nodes[to].parents.push(from);

			this.edges.push({source: from, target: to, trace_number: trace});
		};

		//We have a special link nodes function to make sure we are ref.
		//a node that is actually stored
		this.linkNodes = function(from_node, to_node, trace){

			var from = this.getNodePosition(from_node.plainText);
			var to = this.getNodePosition(to_node.plainText);

			from_node.children.push(to);
			to_node.parents.push(from);

			this.edges.push({source: from, target: to, trace_number: trace});
		};
	},

	storyNode: function(node, plainText, position){
		this.node = node;
		this.plainText = plainText;
		this.position = position;
		this.parents = [];
		this.children = [];
	},
	
	generateGraph: function(traces){
	
		//basic array to hold stories, these are traces reduced to only plainText Nodes
		var stories = [];

		//our Temporal StoryTree (a directed acyclic graph technically)
		var temp_tree = new this.storyTree([], []);
		
		//Make the root node
		var rootnode = new this.storyNode(null, "", -1);
		temp_tree.root_node = rootnode;
		temp_tree.nodes.push(rootnode);

		//Used for linking trees
		var prev_node = null;

		//Split the trace into arrays of strings
		for (var i = 0; i < traces.length; i++){
			this.splitTraceIntoPlainTextArray(traces[i]);
			stories.push(this.current_story);
			this.current_story = [];
		};

		//Now analyze the stories and build our story trees
		for (var i = 0; i < stories.length; i++){
			//Reset for each new story!
			prev_node = null;

			if (stories[i].length > temp_tree.maxdepth){
				temp_tree.maxdepth = stories[i].length - 1;
			};

			for (var j = 0; j < stories[i].length; j++){
				var new_node = new this.storyNode(stories[i][j], stories[i][j].text.replace(/^\s+|\s+$/g, ''), j);

				//Build the Temporal Story Tree
				if (!temp_tree.existsNodeAtPosition(new_node.plainText, j)){
					temp_tree.nodes.push(new_node);

					if (prev_node === null){
						temp_tree.linkNodesPosition(temp_tree.root_node, new_node, i);
					}
				};

				//Link the nodes
				if (!(prev_node === null)){
					temp_tree.linkNodesPosition(prev_node, new_node, i);
				};

				prev_node = new_node;
			};
		};

		this.renderStoryGraph(temp_tree, i);
		
	},
	
	consoleLogEdges: function(s_tree){
		for (var link in s_tree.edges){
			console.log(s_tree.edges[link]);
			console.log(s_tree.nodes[s_tree.edges[link].source].plainText + " " + s_tree.nodes[s_tree.edges[link].target].plainText);
		};
	},
	
	arrayContainsValue: function(array, value){
		for (var i = 0; i < array.length; i++){
			if (array[i] === value){
				return true;
			}
		}
		return false;
	},

	splitTraceIntoPlainTextArray: function(trace){
		for (var i = 0; i < trace.children.length; i++) {
			if (!trace.children[i].hasOwnProperty('children')){
				if (trace.children[i].text.replace(/^\s+|\s+$/g, '').length > 0){
					this.current_story.push(trace.children[i]);
				}
			}else{
				this.splitTraceIntoPlainTextArray(trace.children[i]);
			}
		};
	},

	//Rotate a point by an angle
	rotatePoint : function(x,y,angle,c_x,c_y){

		var s = Math.sin(angle * (Math.PI/180));
		var c = Math.cos(angle * (Math.PI/180));
		
		x -= c_x;
		y -= c_y;

		var x_rot = (x * c) - (y * s);
		var y_rot = (x * s) + (y * c);

		x = c_x + x_rot;
		y = c_y + y_rot;

		return [x, y];
	},

	//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
	getRandomColor : function(){
		var letters = '6789ABC'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 7)];
		}
		return color;
	},
	
	//Function for getting x position
	getXPosition : function(array, position){
		if (position < 1){
			return 0;
		} else {
			x_pos = 0;
			for (var i = position; i > -1; i--){
				x_pos += array[i];
			} 			
			return x_pos;
		}
	},
	
	/*Render a given story tree (DAG) here we do
	some D3 magic!*/        
	renderStoryGraph: function(s_tree, total_traces){

		//Get an array of colours for each edge
		var colours = [];

		for (var i = 0; i < total_traces; i++){
			colours.push(this.getRandomColor());
		}

		var width = $('#bottomBar').width();
		var height = $('#bottomBar').height();
		var animationStep = 400;
		var offset = 20;
		var vert_margin = 20;
		var text_offset = 5;
		var margin = 400;

		var x_inc = (width - margin) / (s_tree.maxdepth - 1);
		
		var svg = d3.select('#bottomBar').append('svg')
			.attr('id', 'benViz')
			.attr('width', width)
			.attr('height', height);

		svg.append('marker')
			.attr('id', "triangle")
			.attr('viewBox', "0 0 10 10")
			.attr('refX', 0)
			.attr('refY', 5)
			.attr('markerUnits', "strokeWidth")
			.attr('markerWidth', 4)
			.attr('markerHeight', 3)
			.attr('orient', "auto")
			.attr('overflow-x', "auto")
			.attr('overflow-y', "auto")
			.append('svg:path')
				.attr('d', "M 0 0 L 10 5 L 0 10 z");

		svg.append("g").attr("id", "links");
		svg.append("g").attr("id", "nodes");
		
		var nodes = s_tree.nodes;
		var links = s_tree.edges;
		
		nodes[0].fixed = true;
		nodes[0].x = 20;
		nodes[0].y = height/2;

		var force = d3.layout.force()
			.size([width, height])
			.nodes(nodes)
			.links(links);

		var drag = force.drag()
			.origin(function(d) { return d; })
			.on("drag", dragmove);

		function dragmove(d) {
			d.fixed = true;
			d3.select(this)
				.attr("y", function (d) {
					var point = d3.mouse(this);
					return point[1]});
		}

		force.charge(-30);
		force.linkStrength(0.1);
		force.chargeDistance(100);
		var poswidth = [];

		var addwidth = function(width, position){
			if (position > -1){

				while (poswidth.length - 1 < position){
					poswidth.push(0);
				}

				if (poswidth[position] < width){
					poswidth[position] = width;
				}
			}
		};

		/*
		 * Make the nodes
		 */
		var node = svg.select("#nodes").selectAll('.node')
			.data(nodes)
			.enter().append('text')
			.attr('class', 'node')
			.text( function(d) { return d.plainText })
			.attr('x', function(d) {
				addwidth(this.getBBox().width, d.position);
				return 0;
			})
			.on("mouseover", function(d) { d3.select(this).style("fill", "white"); })
			.on("mouseout", function(d) { d3.select(this).style("fill", "black"); })
			.call(drag);
		
		node.attr('x', function(d){
			if (d.position < 0){
				d.xpos = 0; 
				return 0;
			} else {
				x_pos = 0;
				for (var i = d.position - 1; i > -1; i--){
					x_pos += poswidth[i];
				}
				d.xpos = x_pos + text_offset + (text_offset * d.position - 1); 			
				return x_pos + text_offset + (text_offset * d.position - 1);
			}
		});

		/*
		 * Make the links
		 */
		var link = svg.select("#links").selectAll('.link')
			.data(links)
			.enter().append('line')
			.attr('class', 'link')
			.attr('stroke-width', '2px')                
			.attr('marker-end', "url(#triangle)")
			.attr('stroke', function(d) {return colours[d.trace_number];})
			.attr('x1', function(d) {return (nodes[d.source].xpos);})
			.attr('x2', function(d) {return (nodes[d.target].xpos);});

		/*
		 * Dynamic X Resizing
		 */
		console.log(poswidth);
		max_x = 0;
		
		for (var i = 0; i < poswidth.length; i++){
			max_x += poswidth[i];
		}
		
		max_x += (text_offset * poswidth.length) + 50;
		svg.attr('width', max_x);
		 
		/*
		 * Force Calculations
		 */
		force.on('tick', function(){

			node.transition().ease('linear').duration(animationStep)
				.attr('y', function(d) { 
					if (d.y > height){
						return height - vert_margin;
					} else if (d.y < vert_margin){
						return vert_margin;
					} else {
						return d.y; 
					}
				});

			link.transition().ease('linear').duration(animationStep)
				.attr('y1', function(d) { 
					if (d.source.y > height - vert_margin){
						return height - vert_margin;
					} else if (d.source.y < vert_margin){
						return vert_margin;
					} else {
						return d.source.y; 
					}
				})
				.attr('y2', function(d) { 
					if (d.target.y > height -vert_margin){
						return height - vert_margin;
					} else if (d.target.y < vert_margin){
						return vert_margin;
					} else {
						return d.target.y; 
					}
				});
		});
		
		force.start();

	},
    onGrammarChange : function(traces) {
		
		//Remove the old
		$('#benViz').remove('svg');
		
		//Add the new
        this.generateGraph(traces);
    },
};
