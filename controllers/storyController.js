const model = require('../models/story');

exports.index = (req, res, next)=>{
    model.find()
    .then(stories=>res.render('./story/index', {stories}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./story/new');
};

exports.create = (req, res, next)=>{
    let story = new model(req.body);//create a new story document
    story.author = req.session.user
    story.save()//insert the document to the database
    .then(story=> res.redirect('/stories'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    model.findById(id).populate('author', 'firstName lastName')
    .then(story=>{    
        console.log(story)
        return res.render('./story/show', {story});
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(story=>{
        return res.render('./story/edit', {story});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, story, {useFindAndModify: false, runValidators: true})
    .then(story=>{
        res.redirect('/stories/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(story =>{
        res.redirect('/stories');
    })
    .catch(err=>next(err));
};