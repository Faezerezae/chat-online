import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    Nav,
    Button,
    Collapse,
    Col,
    Row,
    Dropdown,
    Modal,
    Table
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import MediaImg1 from 'assets/img/chat/1.jpg';
import MediaImg2 from 'assets/img/chat/2.jpg';
import MediaImg3 from 'assets/img/chat/3.jpg';
import MediaImg4 from 'assets/img/chat/4.jpg';
import MediaImg5 from 'assets/img/chat/5.jpg';
import MediaImg6 from 'assets/img/chat/6.jpg';
// import users from 'data/people';
import FalconLightBoxGallery from 'components/common/FalconLightBoxGallery';
import SimpleBarReact from 'simplebar-react';
import { ChatContext } from 'context/Context';
import moment from 'jalali-moment';
import axiosInstance from '../../../../../axios/axiosConfig';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../../../../redux/chatSlice';

const ThreadInfo = ({ thread }) => {
    const dispatch = useDispatch();
    const [isOpenMemberCollapse, setIsOpenMemberCollapse] = useState(false);
    const [isOpenSharedMediaCollapse, setIsOpenSharedMediaCollapse] =
        useState(false);

    const { isOpenThreadInfo, setIsOpenThreadInfo } = useContext(ChatContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null); // State to track hovered row

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const formatDuration = milliseconds => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0 || minutes > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${secs}s`;
    };

    // const user = getUser(thread);
    // const groupMembers =
    //   thread.type === 'group'
    //     ? groups
    //         .find(({ id }) => id === thread.groupId)
    //         .members.map(member => ({
    //           ...users.find(user => user.id === member.userId),
    //           designation: member.designation
    //         }))
    //     : [];

    const handleBlockUser = async userId => {
        try {
            const response = await axiosInstance.patch(
                `/auth/block-user/${userId}`
            );
            if (response.status === 200) {
                if (response.data.user._id) {
                    dispatch(removeUser(userId));
                }
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const [conversationOptions] = useState([
        {
            title: 'Search in Conversation',
            icon: 'search',
            link: '#!'
        },
        {
            title: 'Edit Nicknames',
            icon: 'pencil-alt',
            link: '#!'
        },
        {
            title: 'Change Color',
            icon: 'palette',
            link: '#!'
        },
        {
            title: 'Change Emoji',
            icon: 'thumbs-up',
            link: '#!'
        },
        {
            title: 'Notifications',
            icon: 'bell',
            link: '#!'
        }
    ]);

    const images = [
        MediaImg1,
        MediaImg2,
        MediaImg3,
        MediaImg4,
        MediaImg5,
        MediaImg6
    ];

    return (
        <>
            <div
                className={classNames('conversation-info', {
                    show: isOpenThreadInfo
                })}
            >
                <div className="h-100 overflow-auto">
                    <SimpleBarReact
                        style={{ height: '100%', minWidth: '75px' }}
                    >
                        <Flex
                            alignItems="center"
                            className="position-relative p-3 hover-actions-trigger"
                        >
                            <Dropdown
                                show={isDropdownOpen}
                                onToggle={toggleDropdown}
                                className="dropdown-active-trigger dropdown-chat"
                            >
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-400 z-1 p-0"
                                    onClick={toggleDropdown}
                                >
                                    <FontAwesomeIcon
                                        icon="ellipsis-v"
                                        className="fs-1"
                                        transform="shrink-3"
                                    />
                                </Button>
                                <Dropdown.Menu className="py-2">
                                    <Dropdown.Item
                                        className="cursor-pointer"
                                        onClick={handleShowModal}
                                    >
                                        User visits
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleBlockUser(thread?._id)
                                        }
                                    >
                                        User blocked
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Flex>
                        <Flex
                            alignItems="center"
                            className="position-relative p-3 border-bottom hover-actions-trigger"
                        >
                            <Avatar
                                className={thread.status}
                                size="xl"
                                src={thread.avatar}
                            />
                            <Flex className="ms-2 flex-between-center flex-1">
                                <h6 className="mb-0">
                                    <Link
                                        to="/user/profile"
                                        className="text-decoration-none stretched-link text-700"
                                    >
                                        {thread.username}
                                    </Link>
                                </h6>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-400 z-1 p-0"
                                    onClick={() => setIsOpenThreadInfo(false)}
                                >
                                    <FontAwesomeIcon
                                        icon="times"
                                        className="fs-1"
                                        transform="shrink-3"
                                    />
                                </Button>
                            </Flex>
                        </Flex>
                        <div className="pt-2">
                            <Nav className="flex-column font-sans-serif fw-medium">
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="map-marker-alt"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.ip}
                                </Nav.Link>
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="globe"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.location}
                                </Nav.Link>
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="desktop"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.os}
                                </Nav.Link>
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="mobile-alt"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.device}
                                </Nav.Link>
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="wifi"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.browser}
                                </Nav.Link>
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="sign-out-alt"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    {thread?.currentPath}
                                </Nav.Link>
                                <hr className="my-2" />
                                {conversationOptions?.map((item, index) => (
                                    <Nav.Link
                                        className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                        href={item.link}
                                        key={item.title}
                                    >
                                        <span className="conversation-info-icon">
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="me-1"
                                                transform={classNames(
                                                    'shrink-1',
                                                    {
                                                        'down-3': index === 0
                                                    }
                                                )}
                                            />
                                        </span>{' '}
                                        {item.title}
                                    </Nav.Link>
                                ))}
                                <hr className="my-2" />
                                <Nav.Link
                                    className="px-3 py-1 px-0 text-600 d-flex align-items-center"
                                    href="#!"
                                >
                                    <span className="conversation-info-icon">
                                        <FontAwesomeIcon
                                            icon="cog"
                                            className="me-1"
                                            transform="shrink-1"
                                        />
                                    </span>{' '}
                                    Settings
                                </Nav.Link>
                            </Nav>
                        </div>
                        <hr className="my-2" />
                        <div className="px-3">
                            <div className="title">
                                {thread.type === 'group' && (
                                    <>
                                        <Button
                                            variant="link"
                                            className="btn-accordion hover-text-decoration-none dropdown-indicator w-100"
                                            aria-expanded={
                                                isOpenSharedMediaCollapse
                                            }
                                            onClick={() =>
                                                setIsOpenMemberCollapse(
                                                    !isOpenMemberCollapse
                                                )
                                            }
                                        >
                                            Members
                                        </Button>
                                        <Collapse in={isOpenMemberCollapse}>
                                            {/* <div>
                        {groupMembers.map((member, index) => (
                          <Flex
                            className="align-items-center py-2 hover-actions-trigger"
                            key={index}
                          >
                            <Avatar
                              className={member.status}
                              size="xl"
                              src={member.avatarSrc}
                            />
                            <div className="d-flex flex-1 ms-2 justify-content-between">
                              <div>
                                <h6 className="mb-0">
                                  <Link to="/user/profile" className="text-700">
                                    {member.name}
                                  </Link>
                                </h6>
                                <div className="fs--2 text-400">
                                  {member.designation}
                                </div>
                              </div>
                              <Dropdown className="dropdown-active-trigger hover-actions position-relative z-1">
                                <Dropdown.Toggle
                                  id="dropdown-button"
                                  className="dropdown-caret-none text-400"
                                  variant="link"
                                  size="sm"
                                >
                                  <FontAwesomeIcon icon="ellipsis-h" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="py-2">
                                  <Dropdown.Item className="cursor-pointer">
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item className="cursor-pointer">
                                    View Profile
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </Flex>
                        ))}
                      </div> */}
                                        </Collapse>
                                    </>
                                )}
                                <Button
                                    variant="link"
                                    className="btn-accordion hover-text-decoration-none dropdown-indicator w-100"
                                    aria-expanded={isOpenSharedMediaCollapse}
                                    onClick={() =>
                                        setIsOpenSharedMediaCollapse(
                                            !isOpenSharedMediaCollapse
                                        )
                                    }
                                >
                                    Shared media
                                </Button>
                                <Collapse in={isOpenSharedMediaCollapse}>
                                    <div className="mt-2">
                                        <FalconLightBoxGallery images={images}>
                                            {setImgIndex => (
                                                <Row className="mx-n1">
                                                    {images?.map(
                                                        (image, index) => (
                                                            <Col
                                                                sm={6}
                                                                md={4}
                                                                className="px-1"
                                                                key={index}
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt=""
                                                                    className="img-fluid rounded mb-2 cursor-pointer "
                                                                    onClick={() => {
                                                                        setImgIndex(
                                                                            index
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                        )
                                                    )}
                                                </Row>
                                            )}
                                        </FalconLightBoxGallery>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </SimpleBarReact>
                </div>
            </div>

            {/* Modal for User Visits */}
            <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Pages visited</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>visitDate</th>
                                <th>duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(thread?.onlineDurations || []).map(
                                (item, index) => (
                                    <tr
                                        key={item?._id || index}
                                        onMouseEnter={() =>
                                            setHoveredRow(index)
                                        }
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{ cursor: 'pointer' }}>
                                            {item?.path}
                                            {hoveredRow === index && (
                                                <div className="text-muted">
                                                    {item?.referrer}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {moment(item?.visitDate)
                                                .locale('fa')
                                                .format('YYYY/M/D HH:mm:ss')}
                                        </td>
                                        <td>
                                            {formatDuration(item?.duration)}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ThreadInfo.propTypes = {
    thread: PropTypes.object.isRequired
};

export default ThreadInfo;
