import webbrowser


class Movie():
    """This class defines the require dinformation of the movie website """
    def __init__(self, movie_title, movie_storyline, poster_image, 
                 trailer_youtube):
        """new instance of class is created using this method """
        self.title = movie_title
        self.storyline = movie_storyline
        self.poster_image_url = poster_image
        self.trailer_youtube_url = trailer_youtube  
    
 
