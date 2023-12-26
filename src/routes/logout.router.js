const { Router } = require('express');


const router=Router()

router.get('/',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/api/login?error=fallo en el logout')
        }
    })

    res.redirect('/api/login')

});


module.exports = router;