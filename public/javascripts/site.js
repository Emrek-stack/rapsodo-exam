function followUser(id){
    axios.get('/user/follow/' + id)
    .then(resp => {
        //$.notify('I am the Body');
    });
}