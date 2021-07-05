
class GNode {
  static instances = [];
  constructor(id) {
    this.id = id;
    this.children = [];
    GNode.instances.push(this);
  }

  addChildren(array) {
    this.children = this.children.concat(array);
  }

  static clearVisited() {
    GNode.instances.forEach( n => {
      n.visited = false;
    });
  }

  routeExists(other) {
    this.visited = true;
    if (this == other) return true;
    for (const n of this.children) {
      if (!n.visited && n.routeExists(other)) return true;
    }
    return false;
  }
}

let testGNode = () => {
  let a = new GNode('A');
  let b = new GNode('B');
  let c = new GNode('C');
  let d = new GNode('D');
  let e = new GNode('E');
  let f = new GNode('F');
  let g = new GNode('G');

  a.addChildren([b,c]);
  c.addChildren([d,e]);
  e.addChildren([f]);

  GNode.clearVisited();

  console.log('route exists: ' + a.routeExists(f));
}

// LINKED LIST

class Node {
  constructor(v) {
    this.v = v;
    this.next = null;
  }

  add(node) {
    let current = this;
    while (current.next != null) {
      current = current.next;
    }
    current.next = node;
  }

  pop() {
    let current = this;
    let prev = null;
    if (current == null) return null;
    while (current.next) {
      prev = current;
      current = current.next;
    }
    let res = current;
    if (prev) prev.next = null;
    else return null;
    return res; 
  }

  static fromString(str) {
    if (str.length == 0) return null;
    let letter = str.charAt(0);
    let node = new Node(letter);
    for (let i = 1; i < str.length; i++) {
      let letter = str.charAt(i);
      node.add(new Node(letter));
    }
    return node;
  }

  print() {
    let str = '';
    let current = this;
    while (current != null) {
      str += current.v;
      current = current.next;
    }
    console.log(str);
  }

  reverse() {
    let current = this;
    let prev = null;
    let next = null;
    while (current != null) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    return prev;
  }

  compare(other) {
    let current = this;
    while (current != null) {
      if (other && current.v == other.v) {
        current = current.next;
        other = other.next;
      } else {
        return false;
      }
    }
    return true;
  }

  isPalindrome() {
    let reverse = this.reverse();
    return this.compare(reverse);
  }

  isPalindromeOptimized() {
    let current = this;
    let fast = this;
    let odd = false;
    let stack = [];
    while (fast != null) {
      if (fast.next != null) {
        stack.push(current.v);
        fast = fast.next.next;
        current = current.next;
      } else {
        odd = true;
        current = current.next;
        break;
      }
    }
    while (current != null) {
      let reverse = stack.pop();
      if (current.v != reverse) {
        return false;
      }
      current = current.next;
    }
    return true;
  }
}

//let node = Node.fromString('tattarrattat');
//console.log('is palindrome: ' + node.isPalindromeOptimized());

// BINARY TREE

class BST {
  constructor(v,l=null,r=null) {
    this.value = v;
    this.left = l;
    this.right = r;
  }

  static build(sorted) {
    if (sorted.length == 0) return null;
    let middle = Math.floor(sorted.length / 2);
    let bst = new BST(sorted[middle]);
    let left = sorted.slice(0,middle);
    let right = sorted.slice(middle+1,sorted.length);
    bst.left = BST.build(left);
    bst.right = BST.build(right);
    if (bst.left) bst.left.parent = bst;
    if (bst.right) bst.right.parent = bst;
    return bst;
  }

  linkedListAtEachDepth() {
    let lists = {};
    BST.depth(this,0,lists);
    return lists;
  }

  static depth(bst,d, lists) {
    if (bst == null) return;
    let node = new Node(bst.value);
    if(!lists[d]) lists[d] = node;
    else lists[d].add(node);
    d++;
    BST.depth(bst.left,d,lists);
    BST.depth(bst.right,d,lists);
  }

  static calculateDepth(bst) {
    // calculate depth
    if (bst == null) return -1;
    return Math.max(BST.calculateDepth(bst.length),BST.calculateDepth(bst.right)) + 1;
  }

  static isBalanced(bst) {
    if  (bst == null) return true;
    let diff = Math.abs(BST.calculateDepth(bst.left) - BST.calculateDepth(bst.right));
    if (diff > 1) return false;
    else return BST.isBalanced(bst.left) && BST.isBalanced(bst.right);
  }

  static validate(bst) {
    if (bst == null) return true;
    if (bst.left && bst.left.value > bst.value) return false;
    if (bst.right && bst.right.value < bst.value) return false;
    return BST.validate(bst.left) && BST.validate(bst.right);
  }

  static findNode(bst,value) {
    if (bst == null) return null;
    if (bst.value == value) return bst;
    if (value < bst.value) return BST.findNode(bst.left,value);
    else return BST.findNode(bst.right,value);
  }

  successor(value) {
    // if node right node, then parent of parent, or no successor
    let node = BST.findNode(this,value);
    if (node == null) return -1;
    if (node.right) return node.right.value;
    else if (node.parent == null) return -1;
    else if (node.parent.value > value) return node.parent.value;
    else if (node.parent.parent == null) return -1;
    else if (value < node.parent.parent.value) return node.parent.parent.value;
    else return -1;
  }

  findCommonAncestor(v1,v2) {
    // restriction: could be regular binary tree (not st)
    let n1 = BST.findNode(bst,v1);
    let n2 = BST.findNode(bst,v2);
    let l1 = new Node(n1.value);
    let l2 = new Node(n2.value);
    let c1 = n1.parent;
    while (c1) {
      l1.add(new Node(c1.value)); c1 = c1.parent;
    }
    let c2 = n2.parent;
    while (c2) {
      l2.add(new Node(c2.value)); c2 = c2.parent;
    }
    //intersection
    let res = null;
    do {
      n1 = l1.pop();
      n2 = l2.pop();
      if (n1 == null || n2 == null) break;
      if (n1.v == n2.v) res = n1;
    } while (n1 && n2);
    return res;
  }

}

let bst = BST.build([1,3,5,7,8,9,13,16,19,25,28,42]);
let lists = bst.linkedListAtEachDepth();
let balanced = BST.isBalanced(bst);
let valid = BST.validate(bst);
let successor = bst.successor(19);
let ancestor = bst.findCommonAncestor(1,28)
//console.log(ancestor.v);

class GraphNode {
  constructor(v,parent=null) {
    this.v = v;
    this.parent = parent;
    this.children = [];
  }

  add(node) {
    this.children.push(node);
  }
}

class Graph {
  constructor() {
    this.nodes= {};
  }

  build(dependencies) {
    for (const dep of dependencies) {
      let parent = this.getOrCreate(dep[0]);
      let child = this.getOrCreate(dep[1]);
      child.parent = parent;
      parent.add(child);
    }
  }

  getOrCreate(v) {
    let found = null;
    for (let key in this.nodes) {
      let node = this.nodes[key];
      if (node.v == v) {found = node; break;}
    }
    if (found) return found;
    else {
      let node = new GraphNode(v);
      this.nodes[v] = node;
      return node;
    }
  }

  resolve() {
    let output = [];
    let roots = []
    for (let key in this.nodes) {
      let node = this.nodes[key];
      if (node.parent == null) roots.push(node);
    }
    for (let r of roots) {
      output.push(r.v);
      Graph.visit(r, output);
    }
    return output;
  }

  static visit(node, output) {
    if (!node) return;
    let queue = [];
    node.children.map( child => {
      if (!output.includes(child.v)) output.push(child.v);
      queue.push(child);
    });
    while (queue.length) {
      let node = queue.pop();
      Graph.visit(node,output);
    }
  }

}

let dependencies = [
  ['a','d'],
  ['e','b'],
  ['b','d'],
  ['e','a'],
  ['d','c']
];

let graph = new Graph();
let bt = graph.build(dependencies);
let res = graph.resolve();

//console.log(res);


/// RECURSION

let steps = (n) => {
  if (!this.memo) {
    this.memo = {};
  }
  if (n < 0) return 0;
  if (n == 0) return 1;
  if (!this.memo[n]) {
    this.memo[n] = steps(n-1) + steps(n-2) + steps(n-3);
  }
  return this.memo[n];
};

let startTime = new Date();
res  = steps(0);
let timeDiff = new Date() - startTime; //in ms
//console.log(res);
//console.log(timeDiff + ' ms');

class Tree {
  constructor(v) {
    this.value = v;
    this.children = [];
  }

  add(v) {
    this.children.push(v);
    v.parent = this;
  }

  
  pathToRoot() {
    let path = [];
    let current = this;
    while (current) {
      path.push(current);
      current = current.parent;
    }
    return path;
  }
}

class RobotGrid {
  constructor(c,r,blocks) {
    this.c = c; this.r = r;
    this.grid = {}
    this.block = '■';
    while (blocks-- > 0) {
      let x = Math.floor(Math.random() * c);
      let y = Math.floor(Math.random() * r);
      if ((x == 0 && y==0) || (x == c-1 && y== r-1)) continue;
      this.grid[`${x}:${y}`] = this.block;
    }
  }

  findPath() {
    this.visited = {}
    this.pathFound = false;
    this.tree = new Tree(`0:0`);
    this.path(0,0,this.tree);
    if (this.pathFound) {
      let path = this.endNode.pathToRoot();
      for (let node of path) {
        this.grid[node.value] = 'x';
      }
    }
  }

  path(x,y,parent) {
    if (this.pathFound) return;
    if (x >= this.c || y >= this.r || x < 0 || y < 0) {
      return;
    }
    if (this.grid[`${x}:${y}`] == this.block) return;

    if (this.visited[`${x}:${y}`]) return;
    this.visited[`${x}:${y}`] = true;

    //this.grid[`${x}:${y}`] = '.';

    //tree
    let tree = new Tree(`${x}:${y}`);
    parent.add(tree);

    if (x == this.c - 1 && y == this.r - 1) {
      this.endNode = tree;
      this.pathFound = true;
      return;
    }

    this.path(x+1,y,tree);
    this.path(x,y+1,tree);
    this.path(x-1,y,tree);
    this.path(x,y-1,tree);
  }

  print() {
    let output = '';
    for (let y = 0 ; y < this.r ; ++y) {
      for (let x = 0 ; x < this.c ; ++x) {
        let cell = this.grid[`${x}:${y}`];
        output+=cell?cell:' ';
      }
      output += '\n';
    }
    console.log(output);
  }
}

let robotGrid = new RobotGrid(120,50,100);
//robotGrid.findPath();
//console.log('path exists: ' + robotGrid.pathFound);
//robotGrid.print();

class Profile {
  
  constructor(id) {
    this.id = id;
    this.contacts = [];
    this.country = 'USA';
    this.sector = 'tech';
  }

  addContact(profile) {
    this.contacts.push(profile);
  }

  getPath(contact) {
    let others = contact.getContacts();
    

  }

  getContacts() {
    // remote call to get contacts
    // this.contacts
  }

  getPathRec(contact) {
    this.visited = true;
    if (this == other) return true;
    for (const n of this.children) {
      if (!n.visited && n.getPath(other)) return true;
    }
    return false;
  }

}

// Rotate matrix

class Matrix {
  constructor(size) {
    this.size = size;
    this.data = {};
    for (let y = 0 ; y < size; y++) {
      for (let x = 0 ; x < size; x++) {
        this.data[`${x}:${y}`] = Math.floor(Math.random()*10);
      }
    }
  }

  print() {
    let output = '';
    for (let y = 0 ; y < this.size; y++) {
      for (let x = 0 ; x < this.size; x++) {
        output += this.data[`${x}:${y}`] + ' ';
      }
      output += '\n';
    }
    console.log(output);
  }

  rotate() {
    let matrix  = new Matrix();
    for (let y = 0 ; y < this.size; y++) {
      for (let x = 0 ; x < this.size; x++) {
        matrix.data[`${this.size-1-y}:${x}`] = this.data[`${x}:${y}`];
      }
    }
    this.data = matrix.data;
  }

  rotate_inplace() {
    
  }

}

let matrix = new Matrix(6,6);
//matrix.print();
//matrix.rotate();
//matrix.print();

class Stack {
  constructor() {
    this.data = [];
    this.min = [];
  }

  push(v) {
    let length = this.min.length;
    if (length == 0) this.min.push(v);
    else {
      let last = this.min[length-1];
      if (v < last) this.min.push(v);
    }
    this.data.push(v);
  }

  pop() {
    let v = this.data.pop();
    let length = this.min.length;
    if (length) {
      let last = this.min[length-1];
      if (v == last) { // pop minimum
        this.min.pop();
      }
    }
    return v;
  }

  getMin() {
    if (this.min.length == 0) return -1;
    return this.min[this.min.length-1];
  }
}

let stack  = new Stack();
// stack.push(5);
// stack.push(6);
// stack.push(3);
// stack.push(7);
// stack.pop();
// console.log(stack.getMin());
// stack.pop();
// console.log(stack.getMin());

// Remove duplicates

let getDuplicates = (hm1,hm2) => {
  let duplicates = [];
  for (const key in hm1) {
    if (hm2[key] && !duplicates.includes(key)) duplicates.push(key);
  }
  return duplicates;
};

let hm1 = {};
let max = 10;
for (let i = 0; i < max; i++) {let val = Math.floor(Math.random()*max*2); hm1[val]=val;}
let hm2 = {};
for (let i = 0; i < max; i++) {let val = Math.floor(Math.random()*max*2); hm2[val]=val;}
//let duplicates = getDuplicates(hm1,hm2);
//console.log(duplicates);

// Islands problem

class Matrix2D {
  constructor(size) {
    this.size = size;
    this.data = {};
    for (let y = 0 ; y < size; y++) {
      for (let x = 0 ; x < size; x++) {
        this.data[`${x}:${y}`] = Math.floor(Math.random()*2)%2;
      }
    }
  }

  print() {
    let output = '';
    for (let y = 0 ; y < this.size; y++) {
      for (let x = 0 ; x < this.size; x++) {
        output += this.data[`${x}:${y}`] + ' ';
      }
      output += '\n';
    }
    console.log(output);
  }

  countIslands() {
    this.count = 0;
    for (let y = 0 ; y < this.size; y++) {
      for (let x = 0 ; x < this.size; x++) {
        if (this.data[`${x}:${y}`] == 1) this.visit(x,y,true);
      }
    }
    return this.count;
  }

  visit(x,y,root) {
    if (this.data[`${x}:${y}`] == 0) return;
    if (x > this.size -1 || y > this.size -1 || x < 0 || y < 0) return;
    if (this.data[`${x}:${y}`] == 2) return;
    this.data[`${x}:${y}`] = 2;
    if (root) this.count++;

    this.visit(x,y+1);
    this.visit(x+1,y+1);
    this.visit(x+1,y);
    this.visit(x+1,y-1);
    this.visit(x,y-1);
    this.visit(x-1,y-1);
    this.visit(x-1,y);
    this.visit(x-1,y+1);
  } 
}

let mat = new Matrix2D(5);
 mat.print();
 console.log(mat.countIslands());
 //mat.print();


let input = [
 [2,6],[1,3],[8,10],[15,18] 
];
//let input = [[1,4],[4,5]];

let mergeIntervals = (intervals) => {
  let output = [];
  let sorted = intervals.sort((a,b) => { 
    if (a[0] < b[0]) return -1; else return 1;
  });

  let previous = null;
  for (let interval of intervals) {
    if (!previous) {
      previous = interval;
      continue;
    }

    if (previous[0] <= interval[0] && interval[0] <= previous[1]) {
      let max = previous[1];
      if (interval[1] > previous[1]) max = interval[1];
      let newInterval = [previous[0],max];
      output.push(newInterval);
      previous = newInterval;
    } else {
      if (!output.includes(previous)) output.push(previous);
      previous = interval;
    }
  }
  if (!output.includes(previous)) output.push(previous);
  return output;
};

let intervals = mergeIntervals(input);
//console.log(intervals);

class Parens {
  constructor(str) {
    this.str = str.split('');
    this.stack = [];
  }

  isValid() {
    if (this.str.length == 0) return this.stack.length == 0;
    let elem = this.str.shift();
    if (this.stack.length == 0 || elem == '(') {
      this.stack.push(elem);
      return this.isValid();
    }
    if (elem == ')') {
        if (this.stack.pop() == '(') {
          return this.isValid();
        } else {
          return false;
        }
    } else {
      return false;
    }
  }

  static printAllValid(n) {
    let result = {};
    result.arrays = ['()'];
    Parens.print(1,n,result);
    console.log(result.arrays);
  }

  static print(i,n,result) {
    if (i == n) return;
    let newArrays = [];
    for (let array of result.arrays) {
      let str1 = array.concat('()');
      let str2 = String('()').concat(array);
      let str3 = String('(').concat(array).concat(')');
      if (!newArrays.includes(str1)) newArrays.push(str1);
      if (!newArrays.includes(str2)) newArrays.push(str2)
      if (!newArrays.includes(str3)) newArrays.push(str3);
    }
    result.arrays = newArrays;
    Parens.print(i+1,n,result);
  }
}

let parens = new Parens('((()))()');
//console.log(parens.isValid());

//Parens.printAllValid(10);

// string permutation

let findAllPermutations = (s,b) => {
  let buildHashMap = (str) => {
    let ht = {};
    for (let c of str) {
      if (!ht[c]) ht[c] = 1;
      else ht[c]++;
    }
    return ht;
  }
  let ht = buildHashMap(s);
  let sub_length = s.length;

  let positions = [];
  for (let i = 0; i < b.length; i++) {
    if (i+sub_length > b.length) break;
    let sub_string = b.substring(i,i+sub_length);
    let ht2 = buildHashMap(sub_string);
    if (JSON.stringify(ht,Object.keys(ht).sort()) == JSON.stringify(ht2,Object.keys(ht2).sort())) positions.push(i);
  }
  return positions;
};

findAllPermutations('coco','oocc is ccoo');


 var mergeTwoLists = function(l1, l2) {
  let res = null;
  if (l1 == null) return l2;
  if (l2 == null) return l1;
  let c1 = l1;
  let c2 = l2;
  let cres;
  while (c1 && c2) {
      if (res == null) {
          if (c1.val < c2.val) {
              res = new ListNode(c1.val,null);
              cres = res;
              c1 = c1.next;
          } else {
              res = new ListNode(c2.val,null);
              cres = res;
              c2 = c2.next;
          }
      } else {
          if (c1.val < c2.val) {
              cres.next = new ListNode(c1.val,null);
              c1 = c1.next;
              cres = cres.next;
          } else {
              cres.next = new ListNode(c2.val,null);;
              c2 = c2.next;
              cres = cres.next;
          }
      }
  }
  if (c1 != null) {
      cres.next = c1;
  }
  if (c2 != null) {
      cres.next = c2;
  }
  return res;
};

let l1 = [];

var mergeTwoArrays = function(l1, l2) {
  let res = [];
  if (l1 == []) return l2;
  if (l2 == []) return l1;
  let c1 = 0;
  let c2 = 0;
  let c1l = l1.length;
  let c2l = l1.length;
  while (c1 < c1l && c2 < c2l) {
    if (l1[c1] < l2[c2]) {
      res.push(l1[c1]);
      c1++;

    } else {
      res.push(l2[c2]);
      c2++;
    }
  }
  if (c1 < c1l) {
    res.push(c1);
  }
  else if (c2 < c2l) {
    res.push(c2);
  }
  return res;
}

// Trapping rain water

//let levels = [0,1,3,2,0,1,2,1,0,2];
let heights = [0,0,3,2,0,1,2,1,0,2];

let computeVolume = (heights) => {
  let stack = [];
  let totalVolume = 0;
  for (let i = 0; i < heights.length; i++) {
    let currentVal = heights[i];
    
    while (stack.length != 0 && currentVal > heights[stack[stack.length-1]]) {
      let top = stack[stack.length-1];
      stack.pop();
      if (stack.length == 0)
          break;
      let distance = (i - top - 1);
      let bounded_height = Math.min(heights[i], heights[stack[stack.length-1]]) - heights[top];
      totalVolume += distance * bounded_height;
    }
    stack.push(i);
   
  }
  return totalVolume;
};

//console.log(computeVolume(heights));

// Next greater element

// var nextGreaterElement = function(n) {
//   // split integer into array
//    let str = n.toString();
//    let array = str.split('');

//    array = array.map(x => parseInt(x));
   
//   // sort array from biggest to smallest
//    array.sort( (a,b) => {
//        return (a < b) ? 1 : -1;   
//    });
   
//    let result = array.join('');
       
//   // if numbers same return -1
//    return n == result ? -1 : result;
// };

function findNextPermutation(array) {
  // 1 2 3 => 1 3 2
  // 1 3 2 1 -> 
  for (let i = array.length -1 ; i > 0; i--) {
      let current = array[i];
      let previous = array[i-1];
      if (current > previous) {
          array[i] = previous;
          array[i-1] = current;
          return parseInt(array.join(''));
      } else continue;
  }
  return -1;
}

/**
* @param {number} n
* @return {number}
*/
// var nextGreaterElement = function(n) {
//   // split integer into array
//   let str = n.toString();
//   let array = str.split('');

//   array = array.map(x => parseInt(x));

//   // sort array from biggest to smallest
//   array.sort( (a,b) => {
//      return (a > b) ? 1 : -1;   
//   });
 
//   let result = 0;
//   while(result !== -1) {
//     result = findNextPermutation(array);
//     if (result > n) {
//       return result;
//     }
//   }

//   return result;
// };

const nextGreaterElement = n => {
  let arr = Array.from(`${n}`, Number)
  let max = -Infinity, idx = -1
  for(let i = arr.length-1; i >= 0; i--){
      if(arr[i] < max){
          idx = i
          break
      }
      max = Math.max(max, arr[i])
  }
  if(idx === -1)return -1
  let secondHalf = arr.splice(idx+1).sort((a,b) => a - b)
  for(let i = 0; i < secondHalf.length; i++)
      if(secondHalf[i] > arr[idx]){
          [arr[idx], secondHalf[i]] = [secondHalf[i], arr[idx]]
          break
      }
  let result = +arr.concat(secondHalf).join``
  let max32BitInt = 2147483647
  return result > max32BitInt ? -1 : result
}


//console.log(nextGreaterElement(1231));


/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
// let maxUncrossedLines = function(nums1, nums2) {
//   if (nums1.length === 0 || nums2.length === 0) return 0;
  
//   let removeHead = (arr) => {
//     let copy = arr.slice();
//     copy.shift();
//     return ;
//   };

//   return Math.max(
//     (Number(nums1[0] === nums2[0])) + maxUncrossedLines(removeHead(nums1), removeHead(nums2)),
//     maxUncrossedLines(removeHead(nums1), nums2),
//     maxUncrossedLines(nums1, removeHead(nums2))
//   );
// };

let maxUncrossedLines = (A, B) => {
  let M = A.length,
      N = B.length;
  let go = (i = 0, j = 0) => {
      if (i == M || j == N)
          return 0;
      return Math.max(
          go(i + 1, j + 1) + Number(A[i] == B[j]), // match 🎯 / mismatch
          go(i, j + 1), go(i + 1, j)               // insertion / deletion
      );
  };
  return go();
};

//let nums1, nums2;
//nums1 = [1,4,2]; nums2 = [1,2,4];
// nums1 = [2,5,1,2,5]; 
// nums2 = [10,5,2,1,5,2];

// nums1 = [1,3,7,1,7,5];
// nums2 = [1,9,2,5,1];
//console.log(maxUncrossedLines(nums1,nums2));


//nums = [1,1,1,1]  // target 2
var findTargetSumWays = function(nums, target) {
  let matches = 0;

  let findTarget = (n, count) => {
    if (n == nums.length) {
      if (target == count) matches++;
      return;
    }
    let current = nums[n];
    findTarget(n+1,count+current);
    findTarget(n+1,count-current);
  }

  findTarget(0,0);
  console.log('Hey');
  return matches;
};

//console.log(findTargetSumWays([1,1,1,1,1],3));
