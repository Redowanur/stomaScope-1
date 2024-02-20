import React, { useEffect, useState } from 'react'
import Layout from "../../components/Layout/Layout"
import Item from '../../components/Items/Item'
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component"
import "./history.css"

const History = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [fullImage, setFullImage] = useState("")

    const getUserHistory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/users/upload-history`, {
                params: {
                    page: currentPage
                },
                withCredentials: true
            }
            )


            if (res?.data?.success) {
                setCurrentPage(currentPage + 1)
                setData([...data, ...res?.data?.payload?.history])
                setTotal(res?.data?.payload?.total)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const showFullImage = (item) => {
        setFullImage(item.image)
    }

    const handleOptionsClick = (item) => {
        alert("done")
    }

    const handleCloseModal = () => {
        setFullImage("");
    };

    useEffect(() => {
        getUserHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='font-semibold text-2xl tracking-wide my-6'>Your Upload History</h1>
                <InfiniteScroll
                    dataLength={data.length}
                    next={getUserHistory}
                    hasMore={data.length < total}
                    loader={<h4 style={{ textAlign: 'center', marginTop: '10px' }}>Loading...</h4>}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:w-large'>
                        {
                            data.map((item, index) => (
                                <Item
                                    key={index}
                                    item={item}
                                    onImageClick={showFullImage}
                                    onDotsClick={handleOptionsClick}
                                />
                            ))
                        }
                    </div>
                </InfiniteScroll>
            </div>

            {
                fullImage && (
                    <div className="modal" >
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                        <img className="modal-content" src={fullImage} alt="Full Image" />
                    </div>
                )
            }
        </Layout>
    )
}

export default History
