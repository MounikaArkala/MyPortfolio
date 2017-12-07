import media
import fresh_tomatoes  

# movie 1.
# creates an object of the class Movie.
bahubali = media.Movie("Bahubali",
                       "story about mahishmathi kingdom",
                       "images/Bahubali-2-Posters.jpg",
                       "https://www.youtube.com/watch?v=sOEg_YZQsTI")
                       
# movie 2.
manam = media.Movie("Manam",
                    "story about akkineni family",
                    "images/manam-poster.jpeg",
                    "https://www.youtube.com/watch?v=Y4Bq4SQc_eM")
                    
# movie 3.
robot = media.Movie("Robot",
                    "story about a robot",
                    "images/robo.jpg",
                    "https://www.youtube.com/watch?v=ub3S-9y9Pek")
                    
# movie 4.
janatha_garage = media.Movie("Janatha Garage",
                             """story about a person who
                             operates a garage and helps society""",
                             "images/janatha_garage.jpg",
                             "https://www.youtube.com/watch?v=7O4Hm070Bc8")
                             
# movie 5.
srimanthudu = media.Movie("Srimanthudu",
                          """story about a person adopted a 
                           village and developing it""",
                          "images/srimanthudu.jpg",
                          "https://www.youtube.com/watch?v=dlvgG-hZ9xc")
                          
# movie 6.
chennai_express = media.Movie("Chennai Express",
                              """story about a people from 
                               two different states of india falling in
                               love""",
                              "images/Chennai_Express.jpg",
                              "https://www.youtube.com/watch?v=2ENRB9W5AAA")
                              
movies = [bahubali, manam, robot, janatha_garage, chennai_express, srimanthudu]

# performs opening up a browser and displaying website.
fresh_tomatoes.open_movies_page(movies)
