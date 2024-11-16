# EmoBridge

EmoBridge is a project aimed at providing assistance to individuals with autism spectrum disorder (ASD) through the use of technology, including facial recognition, emotion detection, and other supportive tools to help improve communication, social interaction, and overall quality of life.

This repository contains the backend code for the AutismAid application, which integrates machine learning, AI models, and various technologies to offer real-time support for users with autism.

## Features

- **Emotion Detection**: Uses computer vision to detect emotions from facial expressions.
- **Face Landmark Detection**: Provides face tracking and identification using shape predictors.
- **Interactive UI**: Allows users to interact with the system through a responsive front-end interface.
- **Model Integration**: Integrates deep learning models for emotion and behavior analysis.

## Tech Stack

- **Python**: Backend code and machine learning model training
- **TensorFlow**: For deep learning-based models
- **OpenCV**: For computer vision and facial recognition
- **Dlib**: For facial landmark detection

## Installation

To get started with the project, follow these steps to set up the development environment:

### Prerequisites

1. **Python 3.7+**: Make sure you have Python installed.
2. **Git**: For version control and cloning the repository.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/KUHackFest2024/AutismAid.git
   cd AutismAid
   ```

2. (Optional) Set up a virtual environment for the project:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

3. Run the backend application:

   ```bash
   python app.py  # Or the appropriate entry point for your application
   ```

## Contributing

We welcome contributions to the AutismAid project. Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.
