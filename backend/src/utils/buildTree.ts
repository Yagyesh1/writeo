interface commentsType{
  id : string,
  description : string,
  userId : string,
  parentId : string | null,
  postId : string
}
export const buildTree = (comments : commentsType[])=>{
    const map: Record<string, commentsType & { children: any[] }>  = {}
    comments.forEach((c) => (map[c.id] = {...c , children : []}))
    const tree: (commentsType & {children : any[]})[] = []
    comments.forEach((c)=>{
       if(c.parentId){
           map[c.parentId].children.push(map[c.id])
       }else{
          tree.push(map[c.id])
       }
    })
    return tree;
} 