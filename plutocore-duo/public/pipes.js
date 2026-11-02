/* Shared pipe topology: one implementation for browser feedback and server validation. */
(function(root){
 const masks=[6,10,12,9,6,3,3,9,3];
 const rotate=(mask,n)=>{for(let i=0;i<n;i++)mask=((mask<<1)&15)|(mask>>3);return mask;};
 function connected(rotations){
  if(!Array.isArray(rotations)||rotations.length!==9||!rotations.every(n=>Number.isInteger(n)&&n>=0&&n<4))return false;
  const board=masks.map((m,i)=>rotate(m,rotations[i]));
  if(!(board[3]&8)||!(board[5]&2))return false;
  const visited=new Set([3]),queue=[3],dirs=[[-1,0,1,4],[0,1,2,8],[1,0,4,1],[0,-1,8,2]];
  while(queue.length){const i=queue.shift();if(i===5)return true;for(const [dy,dx,bit,opposite] of dirs){const y=Math.floor(i/3)+dy,x=i%3+dx,j=y*3+x;if(x>=0&&x<3&&y>=0&&y<3&&(board[i]&bit)&&(board[j]&opposite)&&!visited.has(j)){visited.add(j);queue.push(j);}}}return false;
 }
 const api={masks,rotate,connected};if(typeof module!=='undefined')module.exports=api;else root.Pipes=api;
})(typeof window==='undefined'?globalThis:window);

