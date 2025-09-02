import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setError(false);
                setLoading(false);
                setListing(data);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        fetchListing();
    }, [params.listingId])


    return (
        <main>
            {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
            {error && <p className='text-center text-2xl my-7'>something went wrong</p>}

            {listing && !loading && !error && (
                <div>
                    <Swiper navigation >
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='swiperSlideDiv' style={{ backgroundImage: `url(${url})`, height: "300px", backgroundSize: "cover", backgroundPosition: "center" }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )
            }
        </main>
    )
}

export default Listing
