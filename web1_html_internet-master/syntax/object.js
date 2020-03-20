var roles ={
 'programmer':'Jaelin',
 'designer':'Hyelin',
 'CEO':'Yoo'
};

console.log(roles.CEO);
console.log(roles['designer']);

for(var key in roles){
    console.log(roles[key]);
}