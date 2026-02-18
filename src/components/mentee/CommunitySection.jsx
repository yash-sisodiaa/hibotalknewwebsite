import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';

const CommunitySection = () => {

    const Navigate = useNavigate();

    const [communities, setCommunities] = useState([]);
    const user = JSON.parse(localStorage.getItem("user")); 
    
    useEffect(() => {
      fetchMyCommunities();
    }, []);
    
    const fetchMyCommunities = async () => {
      try {
        
        const res = await api.get("community/communities/mentors");
    
        setCommunities(res.data.communities || []);
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <>
    <div  className="HistoryArea">
                    <div  className="HistoryHead">
                        <h3>Community Highlights  <Link to="/all-community">View all</Link> </h3> 
                    </div>
                    <div  className="HistoryBody">
                        <div  className="row">
                            {communities.slice(0,6).map((item) => (
                                <div  className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                <div  className="CommunityBox"
                                onClick={()=> Navigate(`/community-details/${item.id}`)}
                                  style={{ cursor: "pointer" }}
                                >
                                    <h3>
                                        <span  className="Icon"><img src={item?.thumbnailUrl} /> </span>
                                        <span  className="Name">{item?.mentor?.fullname}</span>
                                        <span  className="Time"> {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </h3>
                                    <figcaption>
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                        <h6>#Updatealert</h6>
                                        <ul>
                                            <li><span><img src="/src/assets/images/Like.png" /> </span> {item.likesCount}</li>
                                            <li><span><img src="/src/assets/images/Message.png" /> </span>{item.commentsCount}</li>
                                           
                                        </ul>
                                    </figcaption>
                                </div>
                            </div>
                            ))}
                            

                    </div>
                </div>
                </div>
    </>
  )
}

export default CommunitySection



CommunitySection



