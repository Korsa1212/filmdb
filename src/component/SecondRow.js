import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { supabase } from "../supabaseClient";
import ReactStars from "react-rating-stars-component";


function SecondRow(props) {
    const [user, setUser] = useState(null);

    const [filled, setFilled] = useState(false);
    const [rating,setRating]=useState(null);
    const [ratevalue, setRatevalue] = useState(0); // Initialisation à 0 par défaut




      useEffect(() => {
        const fetchUserData = async () => {
    
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Error fetching user data:", error.message);
          } else {
            console.log(user);
            setUser(user);
          }
        };
    
        fetchUserData();
      }, []);
      useEffect(
        ()=>{
          console.log(user);
  
  
        }
        ,
        [user]
      )
  

      useEffect(() => {
        if (props.data.Ratings && props.data.Ratings.length > 0) {
            setRating(props.data.Ratings[0].Value);
        }
    }, [props.data.Ratings]);


    // useEffect(() => {
    //     // Vérifiez si l'utilisateur a déjà évalué ce film lorsqu'il charge la page
    //     const fetchRating = async () => {
    //         try {
    //             const { data, error } = await supabase
    //                 .from('ratings')
    //                 .select('rating')
    //                 .eq('user_id', user.id)
    //                 .eq('movie_id', props.data.imdbID);

    //             if (error) {
    //                 console.error('Error fetching rating:', error.message);
    //                 return;
    //             }

    //             if (data.length > 0) {
    //                 setFilled(true);
    //                 //setRating(data[0].rating);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching rating:', error.message);
    //         }
    //     };

    //     fetchRating();
    // }, [user, props.data.imdbID]);

    // const handleRateClick = async () => {
    //     if (!filled) {
    //         try {
    //             // Stockez le rating de l'utilisateur dans la base de données Supabase
    //             const { data, error } = await supabase
    //                 .from('ratings')
    //                 .insert([{ movie_id: props.data.imdbID, rating: 10, user_id: user.id }]);

    //             if (error) {
    //                 console.error('Error adding rating:', error.message);
    //                 return;
    //             }

    //             setFilled(true);
    //             //setRating(10); // Mettez à jour le rating affiché
    //         } catch (error) {
    //             console.error('Error adding rating:', error.message);
    //         }
    //     } else {
    //         try {
    //             // Supprimez le rating de l'utilisateur de la base de données Supabase
    //             const { data, error } = await supabase
    //                 .from('ratings')
    //                 .delete()
    //                 .eq('user_id', user.id)
    //                 .eq('movie_id', props.data.imdbID);

    //             if (error) {
    //                 console.error('Error deleting rating:', error.message);
    //                 return;
    //             }

    //             setFilled(false);
    //             //setRating(null); // Mettez à jour le rating affiché
    //         } catch (error) {
    //             console.error('Error deleting rating:', error.message);
    //         }
    //     }
    // };


    useEffect(() => {
        if (user) {
            const fetchRating = async () => {
                try {
                    const { data, error } = await supabase
                        .from('ratings')
                        .select('rating')
                        .eq('user_id', user.id)
                        .eq('movie_id', props.data.imdbID);

                    if (error) {
                        console.error('Error fetching rating:', error.message);
                        return;
                    }

                    if (data.length > 0) {
                        console.log(data[0].rating);
                        setRatevalue(data[0].rating / 2); // Diviser par 2 pour obtenir la note sur 5
                        setFilled(true);
                    }
                } catch (error) {
                    console.error('Error fetching rating:', error.message);
                }
            };

            fetchRating();
        }
    }, [user, props.data.imdbID]);

    const ratingChanged = async (newRating) => {
        console.log(newRating);

        if (!filled) {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .insert([{ movie_id: props.data.imdbID, rating: newRating * 2, user_id: user.id }]);

                if (error) {
                    console.error('Error adding rating:', error.message);
                    return;
                }

                setFilled(true);
                setRatevalue(newRating);
                console.log(newRating);
            } catch (error) {
                console.error('Error adding rating:', error.message);
            }
        } else {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .update({ rating: newRating * 2 })
                    .eq('user_id', user.id)
                    .eq('movie_id', props.data.imdbID);

                if (error) {
                    console.error('Error updating rating:', error.message);
                    return;
                }

                setRatevalue(newRating);
                console.log(newRating);
            } catch (error) {
                console.error('Error updating rating:', error.message);
            }
        }
    };

    useEffect(() => {
        console.log(ratevalue);
    }, [ratevalue]);

    return (
        <div className="row">
            <div className="col-lg-8">
                <h3 style={{color:'white'}} >{props.data.Title}</h3>
                <div style={{color:'white'}}>
                    {props.data.Year} .  {props.data.Rated} .   {props.data.Runtime} 
                </div>
            </div>
            <div className="col-lg-4 d-flex align-items-center " style={{color:'white'}} >
                <div className='col-6 '>
                    <ul style={{listStyleType: "none"}} >
                        <li>Rating filmDB</li>
                        <li >
                            <span style={{fontSize: '24px'}}>
                                <FaStar 
                                    color={true ? 'orange' : 'grey'} 
                                    style={{ cursor: 'pointer' }} 
                                />
                            </span>
                            {rating}
                        </li>
                        <li></li>
                    </ul>
                </div>
                <div className='col-6'>
                    <ul style={{listStyleType: "none"}}>
                       
                            {/* <span  onClick={handleRateClick}>
                                {filled ? (
                                    <FaStar style={{ color: 'orange',fontSize: '24px' }} />
                                ) : (
                                    <FaStar style={{ color: 'grey',fontSize: '24px'  }} />
                                )}
                            </span>  
                            <span  style={{color:'orange',fontSize: '18px'}}>
                                Rate
                            </span> */}
                            {user && ratevalue > 0 && (
                                <>
                                 <li>YOUR RATING</li>
                                <li>
                                    <ReactStars
                                        count={5}
                                        onChange={ratingChanged}
                                        value={ratevalue>0? ratevalue :0} // Utiliser la valeur de l'état
                                        size={30}
                                        isHalf={true}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        fullIcon={<i className="fa fa-star"></i>}
                                        activeColor="orange"
                                    />
                                    <   span style={{color:'orange',fontSize: '18px'}}>
                                        Rate
                                    </span>
                                    </li>
                            </>
                            )}
                             {user && ratevalue === 0 && (
                                <>
                                 <li>YOUR RATING</li>
                                <li>
                                    <ReactStars
                                        count={5}
                                        onChange={ratingChanged}
                                        value={ratevalue>0? ratevalue :0} // Utiliser la valeur de l'état
                                        size={30}
                                        isHalf={true}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        fullIcon={<i className="fa fa-star"></i>}
                                        activeColor="orange"
                                    />
                                    <   span style={{color:'orange',fontSize: '18px'}}>
                                        Rate
                                    </span>
                                    </li>
                            </>
                            )}
                            
                       
                    </ul>
                </div>     
            </div>
        </div>
    );
}

export default SecondRow;
