# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Image.create(url:"http://img.wennermedia.com/social/rs-236765-prince.jpg",tag:"prince", difficulty: 5500)
Image.create(url:"http://cdn3-www.dogtime.com/assets/uploads/2015/05/file_21702_impossibly-cute-puppy-30-300x200.jpg",tag:"pug",difficulty: 7000)
Image.create(url:"http://i.telegraph.co.uk/multimedia/archive/03353/goldfish_3353046b.jpg",tag:"goldfish", difficulty: 3500)
Image.create(url:"https://www.google.com/search?q=skateboarder+hang+time&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjv85Hin5jUAhVG7YMKHREcBBoQ_AUICigB&biw=1280&bih=677#imgrc=F3UhAsaprb9cYM",tag:"skater", difficulty: 15000)
Image.create(url:"http://cdn1-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-2.jpg",tag:"puppy", difficulty: 1500)

ScoreBoard.create(initials: 'mrb', score: 30)
ScoreBoard.create(initials: 'ejf', score: 50)
ScoreBoard.create(initials: 'trz', score: 40)
ScoreBoard.create(initials: 'mrb', score: 10)
ScoreBoard.create(initials: 'rjf', score: 20)
ScoreBoard.create(initials: 'ehb', score: 43)
ScoreBoard.create(initials: 'mjf', score: 13)
ScoreBoard.create(initials: 'lgd', score: 11)
ScoreBoard.create(initials: 'rki', score: 4)
ScoreBoard.create(initials: 'ppd', score: 55)