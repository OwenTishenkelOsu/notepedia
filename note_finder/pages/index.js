import React, { useState } from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

import styles from '../styles/searchPage.module.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);

  const handleSearch = () => {
    setLoading(true);
    console.log(`Searching for "${searchTerm}" of type "${fileType}"`);
    // create loading state and show loading indicator for a short time to simulate a search
    setTimeout(() => {
      // remove loading state and show search results
      if (firstSearch){
        setFirstSearch(false);
      }
      setLoading(false);
    }, 1000);
  }

  const resetSearchHandler = (e) => {
    e.preventDefault();
    setSearchTerm('');
    setFileType([]);
    setFirstSearch(true);
  }

  // create dummy search results from a database of notes
  const searchResults = [
    {
      title: 'Search Result 1',
      description: 'Search result 1 description',
      matchPct: 100,
    }, {
      title: 'Search Result 2',
      description: 'Search result 2 description',
      matchPct: 90,
    }, {
      title: 'Search Result 3',
      description: 'Search result 3 description',
      matchPct: 80,
    }, {
      title: 'Search Result 4',
      description: 'Search result 4 description',
      matchPct: 70,
    }
  ];

  return (
    <div className={styles['search-page']}>
      <h1>Search</h1>
      {console.log()}
      <Form layout="horizontal">
        <Form.Item>
          <Input
            required={true}
            placeholder="Search term"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            mode="multiple"
            placeholder="File type"
            value={fileType}
            onChange={value => setFileType(value)}
          >
            <Option value="pdf">PDF</Option>
            <Option value="doc">DOC</Option>
            <Option value="ppt">PPT</Option>
            <Option value="xls">XLS</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>Search</Button>
        </Form.Item>
        {/* reset filters button */}
        <Form.Item>
          <Button onClick={(e) => {
            resetSearchHandler(e);
          }}>Reset Search</Button>
        </Form.Item>
      </Form>
      {firstSearch ? (
        <p>Enter a search term and file type to begin searching.</p>
      ) : (<div className="styles.search-results">
      {loading ? (
        <div>Loading...</div>
      ) : (
        searchResults.map((result, index) => (
          <div className={styles["search-result"]} key={index}>
            <div className={styles["search-result-title"]}>{result.title}</div>
            <div className={styles["search-result-description"]}>{result.description}</div>
            <div className={styles["search-result-match-pct"]}>{result.matchPct}% match</div>
          </div>
        ))
      )}
    </div>
      )}
    </div>
  );
};

export default SearchPage;
