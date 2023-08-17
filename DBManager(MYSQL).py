from sqlalchemy import create_engine, Column, String, Integer, Date, Float, BLOB, select, exists, URL, func
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import ossapi
import os
import subprocess
import cloudinary.uploader
import cloudinary.api
from config import *

api = ossapi.OssapiV2(client_id, client_secret)
cloudinary.config(
    cloud_name=cloud_name,
    api_key=cloud_key,
    api_secret=cloud_secret
)

class Base(DeclarativeBase):
    pass

# TODO
# ADD A FUNCTION TO BACKUP DB
# ADD A FUNCTION TO GENERATE DAILY MAPS FOR ROWS ALREADY IN DB

class osuMap(Base):
    __tablename__ = 'osuMapInfo'
    map_id = Column(Integer, primary_key=True)
    map_url = Column(String(100))
    MOTD = Column(Integer)

    # Song Details
    title = Column(String(100))
    artist = Column(String(50))
    language = Column(String(20))
    genre = Column(String(20))
    bpm = Column(Integer)

    # Beatmap Info
    map_length = Column(Integer)
    star_rating = Column(Float)
    diff_name = Column(String(255))
    play_count = Column(Integer)
    background = Column(String(100))
    release_date = Column(String(100))

    # Mapper Info
    mapper_name = Column(String(100))
    mapper_previous_names = Column(String(255))
    mapper_country = Column(String(30))
    mapper_url = Column(String(60))
    mapper_avatar = Column(String(60))

    # Media
    cloudinary_link_1 = Column(String(255))
    cloudinary_link_2 = Column(String(255))
    cloudinary_link_3 = Column(String(255))

    def generate_Media(self, number, start, length=15, music=False):

        print("Media not found in cloud. Generating video number %s for: %s" % (str(number), str(self.title)))

        # Pick render settings
        settings = "HideBG"
        if music:
            settings = "HideBG+unmute"

        # File paths
        cwd = os.getcwd()
        danser_path = os.path.join(cwd, "danser")
        temp_path = os.path.join(cwd, "danser", "videos", "temp.mp4")

        # Clear temp folder
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Danser saves files to danser/videos
        clistring = 'danser-cli.exe -skip -id="%s" -settings="%s" -start="%d" -end="%d" -out="%s"' % (
            self.map_id, settings, start, start + length, "temp")
        subprocess.run(clistring, cwd=danser_path, shell=True, check=True, stdout=subprocess.DEVNULL)

        if not os.path.exists(temp_path):
            print("Maybe map not downloaded")
            clistring = 'danser-cli.exe -skip -t="%s" -settings="%s" -start="%d" -end="%d" -out="%s"' % (
                self.title, settings, start, start + length, "temp")
            subprocess.run(clistring, cwd=danser_path, shell=True, check=True, stdout=subprocess.DEVNULL)

        # See if map exists
        if os.path.exists(temp_path):
            self.upload_Media(number)
            return 1
        else:
            return 0

    # TODO: MAKE SURE MEDIA DOES NOT ALREADY EXIST IN CLOUD
    def upload_Media(self, number):

        # Check if folder id already exists.
        # If so, delete and re-upload
        print("Attempting to upload video %s for: %s" % (number, self.title))

        data = cloudinary.uploader.upload(os.path.join(os.getcwd(), "danser", "videos", "temp.mp4"),
                                          resource_type='video',
                                          folder=str(self.map_id),
                                          public_id=self.title.replace("&", "and") + " " + str(number))

        if number == 1:
            self.cloudinary_link_1 = data['playback_url']
        elif number == 2:
            self.cloudinary_link_2 = data['playback_url']
        elif number == 3:
            self.cloudinary_link_3 = data['playback_url']

    def __init__(self, map_id, starting_points, daily_map_number):

        print("Accessing osu! api for map: %s" % (str(map_id)))

        bmsinfo = api.beatmapset(beatmap_id=map_id)
        beatmap = api.beatmap(map_id)
        mapper = api.user(bmsinfo.user_id)

        # Identifiers
        self.map_id = map_id
        self.map_url = beatmap.url
        self.MOTD = daily_map_number

        # Song Details
        self.title = bmsinfo.title
        self.artist = bmsinfo.artist
        self.language = bmsinfo.language['name']
        self.genre = bmsinfo.genre['name']
        self.bpm = bmsinfo.bpm

        # Beatmap Details
        self.map_length = beatmap.total_length
        self.star_rating = beatmap.difficulty_rating
        self.diff_name = beatmap.version
        self.play_count = bmsinfo.play_count
        self.background = bmsinfo.covers.card
        self.release_date = str(bmsinfo.submitted_date)

        # Mapper Info
        self.mapper_name = mapper.username
        self.mapper_previous_names = str(mapper.previous_usernames)
        self.mapper_country = mapper.country.name
        self.mapper_url = "https://osu.ppy.sh/users/%s" % str(mapper.id)
        self.mapper_avatar = mapper.avatar_url

        # Media
        # Check to see if media needs to be generated
        # Media needs to be generated if it is a daily map and the media does not yet exist
        result = cloudinary.Search().expression("folder=%s" % (str(self.map_id))).execute()
        if result['total_count'] >= 3:
            print("Media has already been generated. Skipping.")
            self.cloudinary_link_1 = result['resources'][2]['secure_url'].replace(".mp4", ".m3u8")
            self.cloudinary_link_2 = result['resources'][1]['secure_url'].replace(".mp4", ".m3u8")
            self.cloudinary_link_3 = result['resources'][0]['secure_url'].replace(".mp4", ".m3u8")
            print(self.cloudinary_link_1)
            print(self.cloudinary_link_2)
            print(self.cloudinary_link_3)
        elif daily_map_number == -1:
            print("Not a daily map, Skipping media")
        else:
            self.generate_Media(1, starting_points[0])
            self.generate_Media(2, starting_points[1])
            self.generate_Media(3, starting_points[2], music=True)

# errors: 3912664,
# IF YOU WANT TO EDIT THE DEFAULT STARTING POINTS FOR THE VIDEO JUST ADD ONE MAP AT A TIME
def addMaps(maps, starting_points=None, daily_map=False):
    # Default Video Starting Points
    if starting_points is None:
        starting_points = [10, 40, 70]

    for map_id in maps:
        print()
        # im sorry
        allMaps = session.query(osuMap).all()

        # Add map to daily list
        daily_map_number = -1
        if daily_map:
            list_of_dailies = [x.MOTD for x in allMaps if x.MOTD != -1]
            a = sorted(set(range(1, list_of_dailies[-1])) - set(list_of_dailies))
            daily_map_number = max(list_of_dailies) if a is [] else a[0]

        # Check to see if map is not in db
        map_exists = session.query(exists().where(osuMap.map_id == map_id)).scalar()
        if map_exists:
            print("%s already exists in database. Skipping" % str(map_id))
        else:
            if daily_map_number > 0:
                print("%s is daily map number %s!" % (str(map_id), str(daily_map_number)))
            else:
                print("Adding %s to database." % str(map_id))
            new_osu_map = osuMap(map_id, starting_points, daily_map_number)
            session.add(new_osu_map)
            session.commit()


if __name__ == '__main__':
    engine = create_engine("mysql+pymysql://root:letmein@localhost/test", future=True)

    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(bind=engine)
    session = Session()


    map_id_list = [2096523]


    # 119803, 3912664
    addMaps(map_id_list, daily_map=True)

    print("Finished!")
