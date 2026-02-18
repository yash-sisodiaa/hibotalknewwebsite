import React from 'react'
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';

const All_Community = () => {

    const [communities, setCommunities] = useState([]);
    const user = JSON.parse(localStorage.getItem("user")); 
    
    useEffect(() => {
      fetchMyCommunities();
    }, []);
    
    const fetchMyCommunities = async () => {
      try {
        const res = await api.get("/community/communities/mentors");
    
        setCommunities(res.data.communities || []);
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <>

    <Mentor_Navigation/>


    <Mentor_Sidebar/>



    









    <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>Community</h3>
                <div className="SearchBox">
                    <span><img src="src/assets/images/search.png" /></span>
                    <input type="text" placeholder="Search"/>
                </div>
            </div>

            <div className="CommunityArea">
                <div  className="row">
                            {communities.map((item) => (
                                <div  className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                <div  className="CommunityBox">
                                    <h3>
                                        <span  className="Icon"><img src={item?.thumbnailUrl} /> </span>
                                        <span  className="Name">{item?.mentor?.fullname}</span>
                                        <span  className="Time"> {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </h3>
                                    <figcaption>
                                        <h4><a href="my-community-details.html">{item.title}</a></h4>
                                        <p>{item.description}</p>
                                        <h6>#Updatealert</h6>
                                        <ul>
                                            <li><span><img src="/src/assets/images/Like.png" /> </span> {item.likesCount}</li>
                                            <li><span><img src="/src/assets/images/Message.png" /> </span>{item.commentsCount}</li>
                                            <li><span><img src="/src/assets/images/Bookmark.png" /> </span>0</li>
                                        </ul>
                                    </figcaption>
                                </div>
                            </div>
                            ))}
                            
                        {/* <div className="col-lg-3 col-md-4 col-sm-6">
                        <div
                        className="AddBox"
                        data-toggle="modal"
                        data-target="#CommunityModal"
                        >
                        <span>+</span>
                        <p>Add Community</p>
                        </div>
                    </div> */}

                    </div>
            </div>
         
        </div>
    </div>

    <div className="ModalBox">
        <div className="modal fade" id="CommunityModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox Resources">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">×</button>
                            <h3>Add Community Post</h3>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="UploadBox">
                                    <p>Upload Thumbnail <img src="images/Upload.png" /> </p>
                                    <input type="file" name=""/>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Title"/>
                            </div> 

                            <div className="form-group">
                                <textarea rows="5" className="form-control" placeholder="Caption"></textarea>
                            </div> 
                            
                            <button>Upload File</button>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>

 

    {/* <script type="text/javascript">
        $(window).on('load', function() {
            $('#CommunityModal').modal('show');
        });
    </script> */}
    </>
  )
}

export default All_Community
