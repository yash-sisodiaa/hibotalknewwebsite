import React from 'react';
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';

const ResourceSection = () => {

  const Navigate = useNavigate();

   // const [categories,setCategories] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [activeSpec, setActiveSpec] = useState(null);
    const [resources, setResources] = useState([]);

    useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user?.id) return;

      const res = await api.get(`/getUser/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //console.log('USER DATA', res.data.data);

      const specs = res.data.data.specializations || [];
      setSpecializations(specs);

      if (specs.length > 0) {
        setActiveSpec(specs[0].id);
      }

    } catch (err) {
      console.error(
        'USER FETCH ERROR 👉',
        err.response?.data || err.message
      );
    }
  };

  fetchUser();
}, []);


const fetchResources = async (categoryId) => {
  try {
    const token = localStorage.getItem('token');

    const res = await api.get(`/resource/get-resources/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    //console.log('RESOURCES 👉', res.data.data);
    const filtered = (res.data.data || []).filter(
  (item) => item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc'
   );
    setResources(filtered);

  } catch (err) {
    console.error(
      'RESOURCE FETCH ERROR 👉',
      err.response?.data || err.message
    );
  }
};

useEffect(() => {
  fetchResources(activeSpec);
}, [activeSpec]);

  return (
    <>
    <div  className="HistoryArea">
                    <div  className="HistoryHead">
                        <h3>My Resources <Link to="/all-resources">View all</Link> </h3>
                        <ul>
                           {specializations.map((item) => (
                                <li key={item.id}>
                                <button
                                    className={activeSpec === item.id ? 'active' : ''}
                                    onClick={() => setActiveSpec(item.id)}
                                >
                                    {item.name}
                                </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="HistoryBody">
                        <div className="row">
                            {resources.map((item) => (
                            <div className="col-sm-2" key={item.id}>
                                <div className="ResourcesBox"
                                 onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
                                  style={{ cursor: "pointer" }}
                                >    
                                

                                <figure>
                                {/* VIDEO */}
                                {/* {item.resourceType === 'video' && (
                                    <>
                                    <span className="Play">
                                        <i className="fa fa-play" aria-hidden="true"></i>
                                    </span>

                                    <img
                                        src={item.thumbnailUrl || '/images/Program-1.png'}
                                        alt={item.heading}
                                    />
                                    </>
                                )} */}

                                {/* PDF / PPT – CUSTOM ICON */}
                                {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                                <div className="OnlyIcon">
                                    {item.resourceType === 'pdf' && (
                                    <i className="fa fa-file-pdf-o PdfIcon" aria-hidden="true"></i>
                                    )}

                                    {item.resourceType === 'ppt' && (
                                    <i className="fa fa-file-powerpoint-o PptIcon" aria-hidden="true"></i>
                                    )}

                                    {item.resourceType === 'doc' && (
                                      <i className="fa fa-file-word-o DocIcon" aria-hidden="true"></i>
                                    )}
                                </div>
                                )}

                                </figure>



                                <figcaption>
                                    <p>{item.heading}</p>
                                </figcaption>

                                </div>
                            </div>
                            ))}

                            {/* Add Resource */}
                            <div className="col-sm-2">
                            <div
                                className="AddBox"
                                data-toggle="modal"
                                data-target="#ResourcesModal"
                            >
                                <span>+</span>
                                <p>Add Resources</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
    </>
  )
}

export default ResourceSection
