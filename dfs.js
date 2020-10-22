module.exports = {
    dfs(nodes, links) {
        stack = [];
        used = [];
        for(i = 0; i < nodes.length; i++) {
            used.push(false);
        };
        function search(current) {
            stack.push(current);
            used[current] = true;
            links.forEach(link => {
                if(link.from == current) {
                    if(stack.includes(link.to) && nodes[link.to].type == 'incremental') {
                        link.out = 'loop';
                    }
                    if(!used[link.to])
                        search(link.to);
                }
            });
            stack.pop();
        }
        for(i = 0; i < nodes.length; i++) {
            if(nodes[i].type == 'terminator')
                search(i);
        };
        return links;
    }
}