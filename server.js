var express = require('express');
var app = express();

var bp = require('body-parser');
app.use(bp.json());

app.use(express.static(__dirname + '/public/dist/public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RST', { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var TaskSchema = new mongoose.Schema(
	{
		title       : String,
		description : String,
		completed   : Boolean,
		created_at  : { type: Date, default: Date.now },
		updated_at  : { type: Date, default: Date.now }
	},
	{ timestamps: true }
);
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

app.get('/', (req, res) => {
	Task.find()
		.then((data) => {
			res.json({ data: data });
		})
		.catch((err) => console.log('Something went wrong'));
});

app.post('/create/:title/:description', (req, res) => {
	new Task({
		title       : req.params.title,
		description : req.params.description,
		completed   : false
	})
		.save()
		.then((data) => {
			res.redirect('/');
		})
		.catch((err) => console.log(err));
});

app.get('/retrieve/:id', (req, res) => {
	Task.find({ _id: req.params.id })
		.then((data) => {
			res.json({ data: data });
		})
		.catch((err) => console.log('Something went wrong'));
});

app.put('/update/:id', (req, res) => {
	Task.update(
		{ _id: req.params.id },
		{
			$set : {
				title       : req.body.title,
				description : req.body.description,
				completed   : req.body.completed
			}
		}
	)
		.then((data) => {
			res.redirect('/');
		})
		.catch((err) => res.json(err));
});

app.delete('/destroy/:id', (req, res) => {
	Task.findOneAndRemove({ _id: req.params.id })
		.then((data) => res.redirect('/'))
		.catch((err) => console.log('Something went wrong'));
});

app.listen(8000, () => console.log('Listening on port 8000'));
