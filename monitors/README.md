# tokenomics/monitors

From this folder run this command:

    cat etherTip.txt  | cut -f1-2 | tr '\t' '.' | sed 's/ //g' >data.txt

then

    getTrans --file:data.txt --verbose
    
and you should get all of the transactions on the ethereum tip jar since its inception as JSON data.
